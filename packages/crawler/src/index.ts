import { PlaywrightCrawler, FileDownload, type PlaywrightCrawlingContext } from 'crawlee';
import { crawlerDefault } from './config.js';

// import stealthPlugin from 'puppeteer-extra-plugin-stealth';
// import { firefox } from 'playwright-extra';
// firefox.use(stealthPlugin());


const downloadCrawler = new FileDownload({
    async requestHandler({ body, request, contentType, getKeyValueStore }) {
        const url = new URL(request.url);
        const kvs = await getKeyValueStore();
        await kvs.setValue(url.pathname.replace(/\//g, '_'), body, { contentType: contentType.type });
    },
});


const parseWatchesPage = async (page: PlaywrightCrawlingContext["page"]) => {
    await page.locator('[data-target="#tab-about"]').first().click()
    await page.waitForSelector('.textoverflow__text')
    const description = await page.locator('.textoverflow__text').innerHTML()

    return {
        category: 'watches',
        description
    }
}


const parsePhonesPage = async (page: PlaywrightCrawlingContext["page"]) => {
    await page.locator('[data-target="#tab-specs"]').first().click()
    await page.waitForSelector('#tab-specs')
    const description = await page.locator('.textoverflow__text').first().innerHTML()

    const cpu = await page
        .locator('.pspecs__name', { hasText: /Процессор/ })
        .first()
        .locator('..')
        .locator('.pspecs__val')
        .first()
        .textContent()

    const screenSize = await page
        .locator('.pspecs__name', { hasText: /Диагональ/ })
        .first()
        .locator('..')
        .locator('.pspecs__val')
        .first()
        .textContent()

    return {
        category: 'headphones',
        description,
        screenSize,
        cpu,
        cpuCores: '',
        mainCamera: '',
        frontCamera: '',
        batteryCapacity: '',
        screenResolution: '',
        screenRefreshRate: '',
        pixelDensity: '',
        screenType: '',
        weight: ''
    }
}


const parsers = {
    watch: parseWatchesPage,
    phones: parsePhonesPage
}


const crawler = new PlaywrightCrawler({
    ...crawlerDefault,
    async requestHandler({ request, page, enqueueLinks, log, pushData }) {
        if (
            page.url() !== "https://pitergsm.ru/catalog/watch/" &&
            page.url() !== "https://pitergsm.ru/catalog/phones/"
        ) {
            const label = page.url().slice('https://pitergsm.ru/catalog/'.length).split('/')[0]

            log.info(label)
            log.info(parsers[label])

            const title = await page.locator('.section__title').first().innerText()
            const raw_price = await page.locator('.product__price').first().innerText()

            const specsBrand = await page.locator('.specs__name', { hasText: "Бренд" }).first().innerText()
            const additionalData = await parsers[label](page)

            await pushData({ title, raw_price, ...additionalData }, label);

            const image = await page.locator('.prodslider__pic-img').first().getAttribute('src')

            await downloadCrawler.addRequests([
                'https://pitergsm.ru' + image
            ])
        } else {
            await enqueueLinks({
                selector: 'a.prodcard__name'
            });
        }
    }
});

await crawler.run([
    {
        url: 'https://pitergsm.ru/catalog/watch/',
        crawlDepth: 2,
    },
    {
        url: 'https://pitergsm.ru/catalog/phones/',
        crawlDepth: 2,
    }
]);

await downloadCrawler.run()