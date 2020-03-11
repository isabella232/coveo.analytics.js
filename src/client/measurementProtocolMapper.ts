import {EC, Product, ImpressionList, BaseImpression} from '../plugins/ec';

const globalParamKeysMapping: {[name: string]: string} = {
    anonymizeIp: 'aip',
};

// Based off: https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#enhanced-ecomm
const productKeysMapping: {[key in keyof Product]: string} = {
    id: 'id',
    name: 'nm',
    brand: 'br',
    category: 'ca',
    variant: 'va',
    price: 'pr',
    quantity: 'qt',
    coupon: 'cc',
    position: 'ps',
};

const impressionKeysMapping: {[key in keyof BaseImpression]: string} = {
    id: 'id',
    name: 'nm',
    brand: 'br',
    category: 'ca',
    variant: 'va',
    position: 'ps',
    price: 'pr',
};

const eventKeysMapping: {[name: string]: string} = {
    eventCategory: 'ec',
    eventAction: 'ea',
    eventLabel: 'el',
    eventValue: 'ev',
    page: 'dp',
    visitorId: 'cid',
    clientId: 'cid',
    userId: 'uid',
    currencyCode: 'cu',
};

const productActionsKeysMapping: {[name: string]: string} = {
    action: 'pa',
    list: 'pal',
    listSource: 'pls',
};

const transactionActionsKeysMapping: {[name: string]: string} = {
    id: 'ti',
    revenue: 'tr',
    tax: 'tt',
    shipping: 'ts',
    coupon: 'tcc',
    affiliation: 'ta',
    step: 'cos',
    option: 'col',
};

type DefaultContextInformation = ReturnType<typeof EC.prototype.getDefaultContextInformation> &
    ReturnType<typeof EC.prototype.getLocationInformation>;
const contextInformationMapping: {[key in keyof DefaultContextInformation]: string} = {
    hitType: 't',
    pageViewId: 'pid',
    encoding: 'de',
    location: 'dl',
    referrer: 'dr',
    screenColor: 'sd',
    screenResolution: 'sr',
    title: 'dt',
    userAgent: 'ua',
    language: 'ul',
    eventId: 'z',
    time: 'tm',
};

const measurementProtocolKeysMapping: {[name: string]: string} = {
    ...eventKeysMapping,
    ...productActionsKeysMapping,
    ...transactionActionsKeysMapping,
    ...contextInformationMapping,
    ...globalParamKeysMapping,
};

// Object.keys returns `string[]` this adds types
// see https://github.com/microsoft/TypeScript/pull/12253#issuecomment-393954723
export const keysOf = Object.keys as <T>(o: T) => Extract<keyof T, string>[];

export const convertKeysToMeasurementProtocol = (params: any) => {
    return keysOf(params).reduce((mappedKeys, key) => {
        const newKey = measurementProtocolKeysMapping[key] || key;
        return {
            ...mappedKeys,
            [newKey]: params[key],
        };
    }, {});
};

export const convertProductToMeasurementProtocol = (product: Product, index: number) => {
    return keysOf(product).reduce((mappedProduct, key) => {
        const newKey = `pr${index + 1}${productKeysMapping[key] || key}`;
        return {
            ...mappedProduct,
            [newKey]: product[key],
        };
    }, {});
};

export const convertImpressionListToMeasurementProtocol = (impressionList: ImpressionList, listIndex: number) => {
    const payload: {[name: string]: any} = impressionList.impressions.reduce(
        (mappedImpressions, impression, productIndex) => {
            return {
                ...mappedImpressions,
                ...convertImpressionToMeasurementProtocol(impression, listIndex, productIndex),
            };
        },
        {}
    );

    if (impressionList.listName) {
        const listNameKey = `il${listIndex + 1}nm`;
        payload[listNameKey] = impressionList.listName;
    }
    return payload;
};

const convertImpressionToMeasurementProtocol = (
    impression: BaseImpression,
    listIndex: number,
    productIndex: number
) => {
    return keysOf(impression).reduce((mappedImpression, key) => {
        const newKey = `il${listIndex + 1}pi${productIndex + 1}${impressionKeysMapping[key] || key}`;
        return {
            ...mappedImpression,
            [newKey]: impression[key],
        };
    }, {});
};

const measurementProtocolKeysMappingValues = keysOf(measurementProtocolKeysMapping).map(
    (key) => Object(measurementProtocolKeysMapping)[key]
);
const productKeysMappingValues = keysOf(productKeysMapping).map((key) => Object(productKeysMapping)[key]);
const impressionKeysMappingValues = keysOf(impressionKeysMapping).map((key) => Object(impressionKeysMapping)[key]);

const productSubKeysMatchGroup = productKeysMappingValues.join('|');
const impressSubKeysMatchGroup = impressionKeysMappingValues.join('|');
const productKeyRegex = new RegExp(`^(pr[0-9]+)(${productSubKeysMatchGroup})$`);
const impressionKeyRegex = new RegExp(`^((il[0-9]+pi[0-9]+)(${impressSubKeysMatchGroup}))|(il[0-9]+nm)$`);

export const isMeasurementPrototocolKey = (key: string): boolean => {
    return (
        productKeyRegex.test(key) ||
        impressionKeyRegex.test(key) ||
        measurementProtocolKeysMappingValues.indexOf(key) != -1
    );
};
