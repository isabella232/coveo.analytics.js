import {DefaultEventResponse} from '../src/events';
import type {getCurrentClient} from '../src/coveoua/library';
import coveoua from '../src/coveoua/browser';
import {mockFetch} from '../tests/fetchMock';

declare const self: any;
const getClient: typeof getCurrentClient = (self.coveoanalytics as any).getCurrentClient;
const {fetchMock, fetchMockBeforeEach} = mockFetch();

describe('ec events', () => {
    const initialLocation = `${window.location}`;
    const aToken = 'token';
    const anEndpoint = 'http://bloup';

    const numberFormat = /[0-9]+/;
    const guidFormat = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

    const defaultContextValues = {
        dl: `${location.protocol}//${location.hostname}${
            location.pathname.indexOf('/') === 0 ? location.pathname : `/${location.pathname}`
        }${location.search}`,
        sr: `${screen.width}x${screen.height}`,
        sd: `${screen.colorDepth}-bit`,
        ul: navigator.language,
        ua: navigator.userAgent,
        dr: document.referrer,
        dt: document.title,
        de: document.characterSet,
        pid: expect.stringMatching(guidFormat),
        cid: expect.stringMatching(guidFormat),
        tm: expect.stringMatching(numberFormat),
        z: expect.stringMatching(guidFormat),
    };

    let client: ReturnType<typeof getClient>;

    beforeEach(() => {
        fetchMockBeforeEach();

        changeDocumentLocation(initialLocation);
        const address = `${anEndpoint}/rest/v15/analytics/collect`;
        fetchMock.reset();
        fetchMock.post(address, (url, {body}) => {
            const parsedBody = JSON.parse(body.toString());
            const visitorId = parsedBody.cid;
            return {
                visitId: 'firsttimevisiting',
                visitorId,
            } as DefaultEventResponse;
        });
        coveoua('reset');
        coveoua('init', aToken, anEndpoint);
        client = getClient();
    });

    it('can set custom data at the root level and send a page view event', async () => {
        await coveoua('set', 'custom', {
            verycustom: 'value',
        });
        await coveoua('send', 'pageview');

        const [body] = getParsedBody();

        expect(body).toEqual({
            ...defaultContextValues,
            t: 'pageview',
            verycustom: 'value',
        });
    });

    it('should lowercase the properties of custom objects', async () => {
        await coveoua('set', 'custom', {
            camelCase: 'camel',
            snake_case: 'snake',
            PascalCase: 'pascal',
            UPPER_CASE_SNAKE: 'upper snake',
        });
        await coveoua('send', 'pageview');

        const [body] = getParsedBody();

        expect(body).toEqual({
            ...defaultContextValues,
            t: 'pageview',
            camelcase: 'camel',
            snake_case: 'snake',
            pascalcase: 'pascal',
            upper_case_snake: 'upper snake',
        });
    });

    it('can send a product detail view event', async () => {
        coveoua('ec:addProduct', {name: 'wow', id: 'something', brand: 'brand', unknown: 'ok'});
        coveoua('ec:setAction', 'detail', {storeid: 'amazing'});
        await coveoua('send', 'pageview');

        const [body] = getParsedBody();

        expect(body).toEqual({
            ...defaultContextValues,
            t: 'pageview',
            pr1nm: 'wow',
            pr1id: 'something',
            pr1br: 'brand',
            pa: 'detail',
        });
    });

    it('can send a product detail view event with custom values', async () => {
        coveoua('ec:addProduct', {name: 'wow', id: 'something', brand: 'brand'});
        coveoua('ec:setAction', 'detail', {storeid: 'amazing', custom: {verycustom: 'value'}});
        await coveoua('send', 'pageview');

        const [body] = getParsedBody();

        expect(body).toEqual({
            ...defaultContextValues,
            t: 'pageview',
            pr1nm: 'wow',
            pr1id: 'something',
            pr1br: 'brand',
            pa: 'detail',
            verycustom: 'value',
        });
    });

    it('can send a product impression event', async () => {
        coveoua('ec:addProduct', {name: 'wow', id: 'something', brand: 'brand', unknown: 'ok'});
        coveoua('ec:setAction', 'impression');
        await coveoua('send', 'event');

        const [body] = getParsedBody();

        expect(body).toEqual({
            ...defaultContextValues,
            t: 'event',
            pr1nm: 'wow',
            pr1id: 'something',
            pr1br: 'brand',
            pa: 'impression',
        });
    });

    it('can send a product quickview event', async () => {
        coveoua('ec:addProduct', {name: 'wow', id: 'something', brand: 'brand', unknown: 'ok'});
        coveoua('ec:setAction', 'quickview');
        await coveoua('send', 'event');

        const [body] = getParsedBody();

        expect(body).toEqual({
            ...defaultContextValues,
            t: 'event',
            pr1nm: 'wow',
            pr1id: 'something',
            pr1br: 'brand',
            pa: 'quickview',
        });
    });

    it('can send a product bookmark add event', async () => {
        coveoua('ec:addProduct', {name: 'wow', id: 'something', brand: 'brand', unknown: 'ok'});
        coveoua('ec:setAction', 'bookmark_add');
        await coveoua('send', 'event');

        const [body] = getParsedBody();

        expect(body).toEqual({
            ...defaultContextValues,
            t: 'event',
            pr1nm: 'wow',
            pr1id: 'something',
            pr1br: 'brand',
            pa: 'bookmark_add',
        });
    });

    it('can send a product bookmark remove event', async () => {
        coveoua('ec:addProduct', {name: 'wow', id: 'something', brand: 'brand', unknown: 'ok'});
        coveoua('ec:setAction', 'bookmark_remove');
        await coveoua('send', 'event');

        const [body] = getParsedBody();

        expect(body).toEqual({
            ...defaultContextValues,
            t: 'event',
            pr1nm: 'wow',
            pr1id: 'something',
            pr1br: 'brand',
            pa: 'bookmark_remove',
        });
    });

    it('can send a pageview event with options', async () => {
        await coveoua('send', 'pageview', 'page', {
            title: 'wow',
            location: 'http://right.here',
        });

        const [body] = getParsedBody();

        expect(body).toEqual({
            ...defaultContextValues,
            t: 'pageview',
            dp: 'page',
            dt: 'wow',
            dl: 'http://right.here',
        });
    });

    it('can send a pageview event with options containing custom values', async () => {
        await coveoua('send', 'pageview', 'page', {
            title: 'wow',
            location: 'http://right.here',
            custom: {
                verycustom: 'value',
            },
        });

        const [body] = getParsedBody();

        expect(body).toEqual({
            ...defaultContextValues,
            t: 'pageview',
            dp: 'page',
            dt: 'wow',
            dl: 'http://right.here',
            verycustom: 'value',
        });
    });

    it("doesn't crash when sending an unknown action", async () => {
        coveoua('ec:addProduct', {name: 'wow', id: 'something', brand: 'brand', unknown: 'ok'});
        coveoua('ec:setAction', 'bloup');
        await coveoua('send', 'event');

        const [body] = getParsedBody();

        expect(body).toEqual({
            ...defaultContextValues,
            t: 'event',
            pr1nm: 'wow',
            pr1id: 'something',
            pr1br: 'brand',
        });
    });

    it('should change the pageViewId only when sending a second page view event', async () => {
        await coveoua('send', 'event');
        await coveoua('send', 'event');
        await coveoua('send', 'pageview');
        await coveoua('send', 'event');
        await coveoua('send', 'pageview');
        await coveoua('send', 'event');

        const [event, secondEvent, pageView, thirdEvent, secondPageView, afterSecondPageView] = getParsedBody();

        [event, secondEvent, pageView, thirdEvent, secondPageView, afterSecondPageView]
            .map((e) => e.pid)
            .forEach((pid) => expect(pid).toMatch(guidFormat));

        expect(event.pid).toBe(secondEvent.pid);
        expect(event.pid).toBe(pageView.pid);
        expect(event.pid).toBe(thirdEvent.pid);
        expect(event.pid).not.toBe(secondPageView.pid);
        expect(secondPageView.pid).toBe(afterSecondPageView.pid);
    });

    it('should update the current location and referrer on a second page view', async () => {
        const secondLocation = 'http://very.new/';

        await coveoua('send', 'pageview');
        await coveoua('send', 'event', '1');
        changeDocumentLocation(secondLocation);
        await coveoua('send', 'pageview');
        await coveoua('send', 'event', '2');

        const [pageView, afterFirst, secondPageView, afterSecond] = getParsedBody();

        expect(pageView.dl).toBe(initialLocation);
        expect(pageView.dr).toBe(document.referrer);
        expect(afterFirst.dl).toBe(initialLocation);
        expect(afterFirst.dr).toBe(document.referrer);

        expect(secondPageView.dl).toBe(secondLocation);
        expect(secondPageView.dr).toBe(initialLocation);
        expect(afterSecond.dl).toBe(secondLocation);
        expect(afterSecond.dr).toBe(initialLocation);
    });

    it('should only update the current location and referrer on the first page view (COM-1372)', async () => {
        const secondLocation = 'http://very.new/';

        await coveoua('send', 'event', '1');
        await coveoua('send', 'pageview');
        changeDocumentLocation(secondLocation);
        await coveoua('send', 'event', '2');
        await coveoua('send', 'pageview');
        await coveoua('send', 'event', '3');

        const [firstEvent, firstPageView, secondEvent, secondPageView, thirdEvent] = getParsedBody();

        expect(firstEvent.dl).toBe(initialLocation);
        expect(firstEvent.dr).toBe(document.referrer);
        expect(firstPageView.dl).toBe(initialLocation);
        expect(firstPageView.dr).toBe(document.referrer);
        expect(secondEvent.dl).toBe(initialLocation);
        expect(secondEvent.dr).toBe(document.referrer);

        expect(secondPageView.dl).toBe(secondLocation);
        expect(secondPageView.dr).toBe(initialLocation);
        expect(thirdEvent.dl).toBe(secondLocation);
        expect(thirdEvent.dr).toBe(initialLocation);
    });

    it('should return the same payload', async () => {
        const secondLocation = 'http://very.new/';

        const firstPayload = await client.getPayload('pageview', {
            title: 'wow',
            custom: {
                verycustom: 'value',
            },
        });
        const secondPayload = await client.getPayload('pageview', {
            title: 'wow',
            custom: {
                verycustom: 'value',
            },
        });
        await coveoua('send', 'pageview');
        changeDocumentLocation(secondLocation);
        const firstAfterPayload = await client.getPayload('pageview', {
            title: 'wow',
            custom: {
                verycustom: 'value',
            },
        });
        const secondAfterPayload = await client.getPayload('pageview', {
            title: 'wow',
            custom: {
                verycustom: 'value',
            },
        });

        const firstPayloadToCompare = returnCommonAttributes(firstPayload, ['tm', 'z']);
        const secondPayloadToCompare = returnCommonAttributes(secondPayload, ['tm', 'z']);
        const firstAfterPayloadToCompare = returnCommonAttributes(firstAfterPayload, ['tm', 'z']);
        const secondAfterPayloadToCompare = returnCommonAttributes(secondAfterPayload, ['tm', 'z']);

        expect(firstPayloadToCompare).toEqual(secondPayloadToCompare);
        expect(firstPayloadToCompare.dl).toBe(initialLocation);
        expect(firstPayloadToCompare.dr).toBe(document.referrer);

        expect(firstAfterPayloadToCompare).toEqual(secondAfterPayloadToCompare);
        expect(firstAfterPayloadToCompare.dl).toBe(secondLocation);
        expect(firstAfterPayloadToCompare.dr).toBe(initialLocation);
    });

    it('should return the same parameters', async () => {
        const secondLocation = 'http://very.new/';

        const firstParameters = await client.getParameters('pageview', {
            title: 'wow',
            custom: {
                verycustom: 'value',
            },
        });
        const secondParameters = await client.getParameters('pageview', {
            title: 'wow',
            custom: {
                verycustom: 'value',
            },
        });
        await coveoua('send', 'pageview');
        changeDocumentLocation(secondLocation);
        const firstAfterParameters = await client.getParameters('pageview', {
            title: 'wow',
            custom: {
                verycustom: 'value',
            },
        });
        const secondAfterParameters = await client.getParameters('pageview', {
            title: 'wow',
            custom: {
                verycustom: 'value',
            },
        });

        const firstParametersToCompare = returnCommonAttributes(firstParameters, ['time', 'eventId']);
        const secondParametersToCompare = returnCommonAttributes(secondParameters, ['time', 'eventId']);
        const firstAfterParametersToCompare = returnCommonAttributes(firstAfterParameters, ['time', 'eventId']);
        const secondAfterParametersToCompare = returnCommonAttributes(secondAfterParameters, ['time', 'eventId']);

        expect(firstParametersToCompare).toEqual(secondParametersToCompare);
        expect(firstParametersToCompare.location).toBe(initialLocation);
        expect(firstParametersToCompare.referrer).toBe(document.referrer);

        expect(firstAfterParametersToCompare).toEqual(secondAfterParametersToCompare);
        expect(firstAfterParametersToCompare.location).toBe(secondLocation);
        expect(firstAfterParametersToCompare.referrer).toBe(initialLocation);
    });

    it('should return similar parameters and payload', async () => {
        const parameters = await client.getParameters('pageview', {});
        const payload = await client.getPayload('pageview', {});

        const firstParametersToCompare = returnCommonAttributes(parameters, ['time', 'eventId']);

        expect(firstParametersToCompare).toEqual({
            hitType: payload.t,
            pageViewId: payload.pid,
            encoding: payload.de,
            location: payload.dl,
            referrer: payload.dr,
            screenColor: payload.sd,
            screenResolution: payload.sr,
            title: payload.dt,
            userAgent: payload.ua,
            language: payload.ul,
            visitorId: payload.cid,
        });
    });

    it('should return similar parameters and send', async () => {
        const firstParameters = await client.getParameters('pageview', {});
        await coveoua('send', 'pageview');
        const secondParameters = await client.getParameters('pageview', {});
        await coveoua('send', 'pageview');

        const [pageView, secondPageView] = getParsedBody();

        const firstParametersToCompare = returnCommonAttributes(firstParameters, ['time', 'eventId']);
        const secondParametersToCompare = returnCommonAttributes(secondParameters, ['time', 'eventId']);

        expect(firstParametersToCompare).toEqual({
            hitType: pageView.t,
            pageViewId: pageView.pid,
            encoding: pageView.de,
            location: pageView.dl,
            referrer: pageView.dr,
            screenColor: pageView.sd,
            screenResolution: pageView.sr,
            title: pageView.dt,
            userAgent: pageView.ua,
            language: pageView.ul,
            visitorId: pageView.cid,
        });

        expect(secondParametersToCompare).toEqual({
            hitType: secondPageView.t,
            pageViewId: secondPageView.pid,
            encoding: secondPageView.de,
            location: secondPageView.dl,
            referrer: secondPageView.dr,
            screenColor: secondPageView.sd,
            screenResolution: secondPageView.sr,
            title: secondPageView.dt,
            userAgent: secondPageView.ua,
            language: secondPageView.ul,
            visitorId: secondPageView.cid,
        });
    });

    it('should return similar payload and send', async () => {
        const firstPayload = await client.getPayload('pageview', {});
        await coveoua('send', 'pageview');
        const secondPayload = await client.getPayload('pageview', {});
        await coveoua('send', 'pageview');

        const [pageView, secondPageView] = getParsedBody();

        const firstPayloadToCompare = returnCommonAttributes(firstPayload, ['tm', 'z']);
        const secondPayloadToCompare = returnCommonAttributes(secondPayload, ['tm', 'z']);

        const pageViewToCompare = returnCommonAttributes(pageView, ['tm', 'z']);

        const secondPageViewToCompare = returnCommonAttributes(secondPageView, ['tm', 'z']);

        expect(firstPayloadToCompare).toEqual(pageViewToCompare);
        expect(secondPayloadToCompare).toEqual(secondPageViewToCompare);
    });

    it('should update the current location when a pageview is sent with the page parameter and keep it', async () => {
        await coveoua('send', 'pageview', '/page');
        await coveoua('send', 'event', '1');

        const [event, secondEvent] = getParsedBody();

        expect(event.dl).toBe(`${initialLocation}page`);
        expect(secondEvent.dl).toBe(`${initialLocation}page`);
    });

    it('should keep the current location when a pageview is sent with the page parameter', async () => {
        await coveoua('send', 'pageview', '/page');

        const [event] = getParsedBody();

        expect(event.dl).toBe(`${initialLocation}page`);
    });

    it('should be able to set the userId', async () => {
        const aUser = '👴';
        await coveoua('set', 'userId', aUser);
        await coveoua('send', 'pageview');

        const [event] = getParsedBody();

        expect(event).toEqual({
            ...defaultContextValues,
            t: 'pageview',
            uid: aUser,
        });
    });

    describe('with auto-detection of userId', () => {
        describe('with API key', () => {
            beforeEach(() => {
                coveoua('init', 'xxapikey', anEndpoint);
            });

            it('should set userId to anonymous', async () => {
                await coveoua('send', 'pageview');

                const [event] = getParsedBody();

                expect(event).toEqual({
                    ...defaultContextValues,
                    t: 'pageview',
                    uid: 'anonymous',
                });
            });
            it('should not overwrite existing userId', async () => {
                const aUser = '👴';
                await coveoua('set', 'userId', aUser);
                await coveoua('send', 'pageview');

                const [event] = getParsedBody();

                expect(event).toEqual({
                    ...defaultContextValues,
                    t: 'pageview',
                    uid: aUser,
                });
            });
        });
        describe('with Search Token', () => {
            beforeEach(() => {
                const searchToken =
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
                    'eyJ1cmwiOiJodHRwczovL3d3dy55b3V0dWJlLmNvb' +
                    'S93YXRjaD92PW9IZzVTSllSSEEwIiwidXNlcklkIj' +
                    'oiUmljayBBc3RsZXkiLCJleHAiOjE1MTYyMzkwMjJ9.' +
                    'gOxUfMZuwMFw-QK-q0xOKJ-23YgGwFJbncCIHgIxjcc';
                coveoua('init', searchToken, anEndpoint);
            });

            it('should not set the user id', async () => {
                await coveoua('send', 'pageview');

                const [event] = getParsedBody();

                expect(Object.keys(event)).not.toContain('uid');
            });
            it('should not overwrite existing userId', async () => {
                const steveJobs = 'steve@apple.com';
                await coveoua('set', 'userId', steveJobs);
                await coveoua('send', 'pageview');

                const [event] = getParsedBody();

                expect(event).toEqual({
                    ...defaultContextValues,
                    t: 'pageview',
                    uid: steveJobs,
                });
            });
        });
    });

    it('should be able to set the anonymizeIp', async () => {
        await coveoua('set', 'anonymizeIp', true);
        await coveoua('send', 'pageview');

        const [event] = getParsedBody();

        expect(event).toEqual({
            ...defaultContextValues,
            t: 'pageview',
            aip: 1,
        });
    });

    it('should be able to set the anonymizeIp with "true" string', async () => {
        await coveoua('set', 'anonymizeIp', 'true');
        await coveoua('send', 'pageview');

        const [event] = getParsedBody();

        expect(event).toEqual({
            ...defaultContextValues,
            t: 'pageview',
            aip: 1,
        });
    });

    it('should be able to set the anonymizeIp to false', async () => {
        await coveoua('set', 'anonymizeIp', false);
        await coveoua('send', 'pageview');

        const [event] = getParsedBody();

        expect(event).toEqual({
            ...defaultContextValues,
            t: 'pageview',
        });
    });

    it('should be able to set the anonymizeIp to false for undefined value', async () => {
        await coveoua('set', 'anonymizeIp');
        await coveoua('send', 'pageview');

        const [event] = getParsedBody();

        expect(event).toEqual({
            ...defaultContextValues,
            t: 'pageview',
        });
    });

    it('should be able to set the anonymizeIp to true for anything in between', async () => {
        await coveoua('set', 'anonymizeIp', 'pôtato');
        await coveoua('send', 'pageview');

        const [event] = getParsedBody();

        expect(event).toEqual({
            ...defaultContextValues,
            t: 'pageview',
            aip: 1,
        });
    });

    it('should remove unknown measurement protocol keys', async () => {
        await coveoua('set', 'unknownParam', 'unknown');
        await coveoua('send', 'pageview');

        const [body] = getParsedBody();

        expect(Object.keys(body)).not.toContain('unknownParam');
    });

    it('should remove unknown measurement protocol product keys', async () => {
        await coveoua('ec:addProduct', {name: 'wow', id: 'something', brand: 'brand', unknown: 'ok'});
        await coveoua('send', 'pageview');

        const [body] = getParsedBody();

        expect(Object.keys(body)).not.toContain('pr1unknown');
    });

    it('should append custom values to product', async () => {
        var partialProduct = {name: 'wow', custom: {verycustom: 'value'}};
        await coveoua('ec:addProduct', partialProduct);
        await coveoua('send', 'pageview');

        const [body] = getParsedBody();

        expect(body).toEqual({
            ...defaultContextValues,
            t: 'pageview',
            pr1nm: partialProduct.name,
            pr1verycustom: partialProduct.custom.verycustom,
        });
    });

    it('should be able to follow the complete addToCart flow', async () => {
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#add-remove-cart
        const product = {
            id: 'id',
            name: 'name',
            category: 'category',
            brand: 'brand',
            variant: 'variant',
            price: 0,
            quantity: 0,
        };
        await coveoua('set', 'currencyCode', 'EUR');
        await coveoua('ec:addProduct', product);
        await coveoua('ec:setAction', 'add');
        await coveoua('send', 'event', 'UX', 'click', 'add to cart');

        const [event] = getParsedBody();

        // Event directly extracted from `ca.js` with the same sequence of event.
        expect(event).toEqual({
            pid: expect.stringMatching(guidFormat), // Key changed from `a`
            cid: expect.stringMatching(guidFormat),
            cu: 'EUR',
            de: defaultContextValues.de,
            dl: defaultContextValues.dl,
            dr: defaultContextValues.dr,
            dt: defaultContextValues.dt,
            ea: 'click',
            ec: 'UX',
            el: 'add to cart',
            pa: 'add',
            pr1br: product.brand,
            pr1ca: product.category,
            pr1id: product.id,
            pr1nm: product.name,
            pr1va: product.variant,
            pr1pr: product.price,
            pr1qt: product.quantity,
            sd: defaultContextValues.sd,
            sr: defaultContextValues.sr,
            t: 'event',
            // tid: "toosogoogleanalyticsevents0l18in4y", removed, this one is picked up from the `ca("create", TID)` call.
            tm: expect.stringMatching(numberFormat),
            ua: defaultContextValues.ua, // Added
            ul: defaultContextValues.ul,
            // v: 1, removed, we don't send version as of now.
            z: expect.stringMatching(guidFormat),
        });
    });

    it('should be able to follow the complete addImpression flow', async () => {
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#product-impression
        const productImpression1 = {
            id: 'P12345',
            name: 'Android Warhol T-Shirt',
            category: 'Apparel/T-Shirts',
            brand: 'Google',
            variant: 'black',
            list: 'Search Results',
            position: 1,
        };
        const productImpression2 = {
            id: 'P67890',
            name: 'YouTube Organic T-Shirt',
            category: 'Apparel/T-Shirts',
            brand: 'YouTube',
            variant: 'gray',
            list: 'Search Results',
            position: 2,
        };

        await coveoua('ec:addImpression', productImpression1);
        await coveoua('ec:addImpression', productImpression2);
        await coveoua('send', 'pageview');

        const [event] = getParsedBody();

        expect(event).toEqual({
            pid: expect.stringMatching(guidFormat),
            cid: expect.stringMatching(guidFormat),
            de: defaultContextValues.de,
            dl: defaultContextValues.dl,
            dr: defaultContextValues.dr,
            dt: defaultContextValues.dt,
            il1nm: productImpression1.list,
            il1pi1id: productImpression1.id,
            il1pi1nm: productImpression1.name,
            il1pi1ca: productImpression1.category,
            il1pi1br: productImpression1.brand,
            il1pi1va: productImpression1.variant,
            il1pi1ps: productImpression1.position,
            il1pi2id: productImpression2.id,
            il1pi2nm: productImpression2.name,
            il1pi2ca: productImpression2.category,
            il1pi2br: productImpression2.brand,
            il1pi2va: productImpression2.variant,
            il1pi2ps: productImpression2.position,
            sd: defaultContextValues.sd,
            sr: defaultContextValues.sr,
            t: 'pageview',
            tm: expect.stringMatching(numberFormat),
            ua: defaultContextValues.ua,
            ul: defaultContextValues.ul,
            z: expect.stringMatching(guidFormat),
        });
    });

    it('ignores properties that are specific to another action', async () => {
        await coveoua('ec:setAction', 'purchase', {
            id: 'something',
            rating: '5/7',
        });
        await coveoua('send', 'event');

        const [body] = getParsedBody();

        expect(body).toEqual({
            ...defaultContextValues,
            pa: 'purchase',
            t: 'event',
            ti: 'something',
        });
    });

    describe('with the coveo extensions', () => {
        it('can send a quote event with a specific id and affiliation', async () => {
            await coveoua('ec:setAction', 'quote', {
                id: 'something',
                affiliation: 'my super store',
            });
            await coveoua('send', 'event');

            const [body] = getParsedBody();

            expect(body).toEqual({
                ...defaultContextValues,
                pa: 'quote',
                t: 'event',
                quoteId: 'something',
                quoteAffiliation: 'my super store',
            });
        });

        it('can set an affiliation before defining the quote action', async () => {
            coveoua('set', 'affiliation', 'super store');
            await coveoua('ec:setAction', 'quote');
            await coveoua('send', 'event');

            const [body] = getParsedBody();

            expect(body).toEqual({
                ...defaultContextValues,
                pa: 'quote',
                t: 'event',
                quoteAffiliation: 'super store',
            });
        });

        it('can send a review event with a specific id and reviewRating', async () => {
            await coveoua('ec:setAction', 'review', {
                id: 'something',
                reviewRating: 5,
            });
            await coveoua('send', 'event');

            const [body] = getParsedBody();

            expect(body).toEqual({
                ...defaultContextValues,
                pa: 'review',
                t: 'event',
                reviewId: 'something',
                reviewRating: 5,
            });
        });

        it('can send a product with the group property', async () => {
            await coveoua('ec:addProduct', {
                id: 'something',
                group: 'nsync',
            });
            await coveoua('send', 'event');

            const [body] = getParsedBody();

            expect(body).toEqual({
                ...defaultContextValues,
                t: 'event',
                pr1id: 'something',
                pr1group: 'nsync',
            });
        });

        it('can send an event with base extension keys', async () => {
            await coveoua('send', 'event', {
                contentId: 123,
                contentIdKey: 'bloup',
                contentType: 'fish',
                searchHub: 'searchhub',
                tab: 'tab',
                searchUid: 'searchuid',
                permanentId: 'somethingsomething',
                contentLocale: 'en-us',
                invalidOne: 'nope',
            });

            const [body] = getParsedBody();

            expect(body).toEqual({
                ...defaultContextValues,
                t: 'event',
                contentId: 123,
                contentIdKey: 'bloup',
                contentType: 'fish',
                searchHub: 'searchhub',
                tab: 'tab',
                searchUid: 'searchuid',
                permanentId: 'somethingsomething',
                contentLocale: 'en-us',
            });
        });
    });

    const getParsedBody = (): any[] => {
        return fetchMock.calls().map(([, {body}]) => JSON.parse(body.toString()));
    };

    const changeDocumentLocation = (url: string) => {
        delete window.location;
        // @ts-ignore
        // Ooommmpf... JSDOM does not support any form of navigation, so let's overwrite the whole thing 💥.
        window.location = new URL(url);
    };

    const returnCommonAttributes = <T>(payload: T, attributesToRemove: Array<keyof T>) => {
        attributesToRemove.forEach((attribute) => delete payload[attribute]);
        return payload;
    };
});
