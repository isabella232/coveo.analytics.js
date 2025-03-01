import {DocumentInformation, FacetStateRequest} from '../events';

export enum SearchPageEvents {
    /**
     * Identifies the search event that gets logged when the initial query is performed as a result of loading a search interface.
     */
    interfaceLoad = 'interfaceLoad',
    /**
     * Identifies the search event that gets logged when a new tab is selected in the search interface.
     */
    interfaceChange = 'interfaceChange',
    /**
     * Identifies the search event that gets logged when `enableAutoCorrection: true` and the query is automatically corrected.
     */
    didyoumeanAutomatic = 'didyoumeanAutomatic',
    /**
     * Identifies the search event that gets logged when the query suggestion with the corrected term is selected and successfully updates the query.
     */
    didyoumeanClick = 'didyoumeanClick',
    /**
     * Identifies the search event that gets logged when a sorting method is selected.
     */
    resultsSort = 'resultsSort',
    /**
     * Identifies the search event that gets logged when a submit button is selected on a search box.
     */
    searchboxSubmit = 'searchboxSubmit',
    /**
     * Identifies the search event that gets logged when a clear button is selected on a search box.
     */
    searchboxClear = 'searchboxClear',
    /**
     * The search-as-you-type event that gets logged when a query is automatically generated, and results are displayed while a user is entering text in the search box before they voluntarily submit the query.
     */
    searchboxAsYouType = 'searchboxAsYouType',
    /**
     * The event that gets logged when a breadcrumb facet is selected and the query is updated.
     */
    breadcrumbFacet = 'breadcrumbFacet',
    /**
     * Identifies the search event that gets logged when the event to clear the current breadcrumbs is triggered.
     */
    breadcrumbResetAll = 'breadcrumbResetAll',
    /**
     * Identifies the click event that gets logged when the Quick View element is selected and a Quick View modal of the document is displayed.
     */
    documentQuickview = 'documentQuickview',
    /**
     * Identifies the click event that gets logged when a user clicks on a search result to open an item.
     */
    documentOpen = 'documentOpen',
    /**
     * Identifies the search event that gets logged when a user clicks a query suggestion based on the usage analytics recorded queries.
     */
    omniboxAnalytics = 'omniboxAnalytics',
    /**
     * Identifies the search event that gets logged when a suggested search query is selected from a standalone searchbox.
     */
    omniboxFromLink = 'omniboxFromLink',
    /**
     * Identifies the search event that gets logged when the search page loads with a query, such as when a user clicks a link pointing to a search results page with a query or enters a query in a standalone search box that points to a search page.
     */
    searchFromLink = 'searchFromLink',
    /**
     * Identifies the custom event that gets logged when a user action triggers a notification set in the effective query pipeline on the search page.
     */
    triggerNotify = 'notify',
    /**
     * Identifies the custom event that gets logged when a user action executes a JavaScript function set in the effective query pipeline on the search page.
     */
    triggerExecute = 'execute',
    /**
     * Identifies the custom event that gets logged when a user action triggers a new query set in the effective query pipeline on the search page.
     */
    triggerQuery = 'query',
    /**
     * Identifies the custom event that gets logged when a user action redirects them to a URL set in the effective query pipeline on the search page.
     */
    triggerRedirect = 'redirect',
    /**
     * Identifies the custom event that gets logged when the Results per page component is selected.
     */
    pagerResize = 'pagerResize',
    /**
     * Identifies the custom event that gets logged when a page number is selected and more items are loaded.
     */
    pagerNumber = 'pagerNumber',
    /**
     * Identifies the custom event that gets logged when the Next Page link is selected and more items are loaded.
     */
    pagerNext = 'pagerNext',
    /**
     * Identifies the custom event that gets logged when the Previous Page link is selected and more items are loaded.
     */
    pagerPrevious = 'pagerPrevious',
    /**
     * Identifies the custom event that gets logged when the user scrolls to the bottom of the item page and more results are loaded.
     */
    pagerScrolling = 'pagerScrolling',
    /**
     * Identifies the search event that gets logged when the clearing all selected values of a static filter.
     */
    staticFilterClearAll = 'staticFilterClearAll',
    /**
     * Identifies the search event that gets logged when a static filter check box is selected and the query is updated.
     */
    staticFilterSelect = 'staticFilterSelect',
    /**
     * Identifies the search event that gets logged when a static filter check box is deselected and the query is updated.
     */
    staticFilterDeselect = 'staticFilterDeselect',
    /**
     * Identifies the search event that gets logged when the Clear Facet button is selected.
     */
    facetClearAll = 'facetClearAll',
    /**
     * Identifies the custom event that gets logged when a query is being typed into the facet search box.
     */
    facetSearch = 'facetSearch',
    /**
     * Identifies the search event that gets logged when a facet check box is selected and the query is updated.
     */
    facetSelect = 'facetSelect',
    /**
     * Identifies the search event that gets logged when all filters on a facet are selected.
     */
    facetSelectAll = 'facetSelectAll',
    /**
     * Identifies the search event that gets logged when a facet check box is deselected and the query is updated.
     */
    facetDeselect = 'facetDeselect',
    /**
     * Identifies the search event that gets logged when a user clicks a facet value to filter out results containing the facet value.
     */
    facetExclude = 'facetExclude',
    /**
     * Identifies the search event that gets logged when a user clicks a facet value to not filter out results containing the facet value.
     */
    facetUnexclude = 'facetUnexclude',
    /**
     * Identifies the search event that gets logged when the sort criteria on a facet is updated.
     */
    facetUpdateSort = 'facetUpdateSort',
    /**
     * The custom event that gets logged when an end-user expands a facet to see additional values.
     */
    facetShowMore = 'showMoreFacetResults',
    /**
     * The custom event that gets logged when an end-user collapses a facet to see less values.
     */
    facetShowLess = 'showLessFacetResults',
    /**
     * Identifies the custom event that gets logged when a user query encounters an error during execution.
     */
    queryError = 'query',
    /**
     * Identifies the search and custom event that gets logged when a user clicks the Go Back link after an error page.
     */
    queryErrorBack = 'errorBack',
    /**
     * Identifies the search and custom event that gets logged when a user clears the query box after an error page.
     */
    queryErrorClear = 'errorClearQuery',
    /**
     * Identifies the search and custom event that gets logged when a user clicks the Retry link after an error page.
     */
    queryErrorRetry = 'errorRetry',
    /**
     * Identifies the custom event that gets logged when a user performs a query that returns recommendations in the Recommendations panel.
     */
    recommendation = 'recommendation',
    /**
     * Identifies the search event that gets logged when a user action (that is not a query) reloads the Recommendations panel with new recommendations.
     */
    recommendationInterfaceLoad = 'recommendationInterfaceLoad',
    /**
     * Identifies the click event that gets logged when a user clicks a recommendation in the Recommendations panel.
     */
    recommendationOpen = 'recommendationOpen',
    /**
     * Identifies the custom event that gets logged when a user identifies a smart snippet answer as relevant.
     */
    likeSmartSnippet = 'likeSmartSnippet',
    /**
     * Identifies the custom event that gets logged when a user identifies a smart snippet answer as irrelevant.
     */
    dislikeSmartSnippet = 'dislikeSmartSnippet',
    /**
     * Identifies the custom event that gets logged when a user expand a smart snippet answer.
     */
    expandSmartSnippet = 'expandSmartSnippet',
    /**
     * Identifies the custom event that gets logged when a user collapse a smart snippet answer.
     */
    collapseSmartSnippet = 'collapseSmartSnippet',
    /**
     * Identifies the custom event that gets logged when a user open a smart snippet explanation modal for feedback.
     */
    openSmartSnippetFeedbackModal = 'openSmartSnippetFeedbackModal',
    /**
     * Identifies the custom event that gets logged when a user close a smart snippet explanation modal for feedback.
     */
    closeSmartSnippetFeedbackModal = 'closeSmartSnippetFeedbackModal',
    /**
     * Identifies the custom event that gets logged when a user sends an explanation for a smart snippet irrelevant answer.
     */
    sendSmartSnippetReason = 'sendSmartSnippetReason',
    /**
     * Identifies the custom event that gets logged when a snippet suggestion for a related question is expanded.
     */
    expandSmartSnippetSuggestion = 'expandSmartSnippetSuggestion',
    /**
     * Identifies the custom event that gets logged when a snippet suggestion for a related question is collapsed.
     */
    collapseSmartSnippetSuggestion = 'collapseSmartSnippetSuggestion',
    /**
     * Identifies the search event that gets logged when a recent queries list item gets clicked.
     */
    recentQueryClick = 'recentQueriesClick',
    /**
     * Identifies the custom event that gets logged when a recent queries list gets cleared.
     */
    clearRecentQueries = 'clearRecentQueries',
    /**
     * Identifies the custom event that gets logged when a recently clicked results list item gets clicked.
     */
    recentResultClick = 'recentResultClick',
    /**
     * Identifies the custom event that gets logged when a recently clicked results list gets cleared.
     */
    clearRecentResults = 'clearRecentResults',
    /**
     * Identifies the search event that gets logged when a user clicks the Cancel last action link when no results are returned following their last action.
     */
    noResultsBack = 'noResultsBack',
}

export const CustomEventsTypes: Partial<Record<SearchPageEvents, string>> = {
    [SearchPageEvents.triggerNotify]: 'queryPipelineTriggers',
    [SearchPageEvents.triggerExecute]: 'queryPipelineTriggers',
    [SearchPageEvents.triggerQuery]: 'queryPipelineTriggers',
    [SearchPageEvents.triggerRedirect]: 'queryPipelineTriggers',
    [SearchPageEvents.queryError]: 'errors',
    [SearchPageEvents.queryErrorBack]: 'errors',
    [SearchPageEvents.queryErrorClear]: 'errors',
    [SearchPageEvents.queryErrorRetry]: 'errors',
    [SearchPageEvents.pagerNext]: 'getMoreResults',
    [SearchPageEvents.pagerPrevious]: 'getMoreResults',
    [SearchPageEvents.pagerNumber]: 'getMoreResults',
    [SearchPageEvents.pagerResize]: 'getMoreResults',
    [SearchPageEvents.pagerScrolling]: 'getMoreResults',
    [SearchPageEvents.facetSearch]: 'facet',
    [SearchPageEvents.facetShowLess]: 'facet',
    [SearchPageEvents.facetShowMore]: 'facet',
    [SearchPageEvents.recommendation]: 'recommendation',
    [SearchPageEvents.likeSmartSnippet]: 'smartSnippet',
    [SearchPageEvents.dislikeSmartSnippet]: 'smartSnippet',
    [SearchPageEvents.expandSmartSnippet]: 'smartSnippet',
    [SearchPageEvents.collapseSmartSnippet]: 'smartSnippet',
    [SearchPageEvents.openSmartSnippetFeedbackModal]: 'smartSnippet',
    [SearchPageEvents.closeSmartSnippetFeedbackModal]: 'smartSnippet',
    [SearchPageEvents.sendSmartSnippetReason]: 'smartSnippet',
    [SearchPageEvents.expandSmartSnippetSuggestion]: 'smartSnippetSuggestions',
    [SearchPageEvents.collapseSmartSnippetSuggestion]: 'smartSnippetSuggestions',
    [SearchPageEvents.clearRecentQueries]: 'recentQueries',
    [SearchPageEvents.recentResultClick]: 'recentlyClickedDocuments',
    [SearchPageEvents.clearRecentResults]: 'recentlyClickedDocuments',
};

export interface StaticFilterMetadata {
    staticFilterId: string;
}

export interface StaticFilterToggleValueMetadata extends StaticFilterMetadata {
    staticFilterValue: StaticFilterValueMetadata;
}

interface StaticFilterValueMetadata {
    caption: string;
    expression: string;
}

export interface FacetMetadata {
    facetId: string;
    facetField: string;
    facetValue: string;
    facetTitle: string;
}

export type FacetStateMetadata = FacetStateRequest;
export interface FacetRangeMetadata extends Omit<FacetMetadata, 'facetValue'> {
    facetRangeStart: string;
    facetRangeEnd: string;
    facetRangeEndInclusive: boolean;
}

export interface CategoryFacetMetadata {
    categoryFacetId: string;
    categoryFacetField: string;
    categoryFacetPath: string[];
    categoryFacetTitle: string;
}

export interface OmniboxSuggestionsMetadata {
    suggestionRanking: number;
    partialQueries: string | string[];
    suggestions: string | string[];
    partialQuery: string;
    querySuggestResponseId: string;
}

export interface DocumentIdentifier {
    contentIDKey: string;
    contentIDValue: string;
}

export interface InterfaceChangeMetadata {
    interfaceChangeTo: string;
}

export interface ResultsSortMetadata {
    resultsSortBy: string;
}

export interface TriggerNotifyMetadata {
    notification: string;
}

export interface TriggerExecuteMetadata {
    executed: string;
}

export interface TriggerRedirectMetadata {
    redirectedTo: string;
}

export interface PagerResizeMetadata {
    currentResultsPerPage: number;
}

export interface PagerMetadata {
    pagerNumber: number;
}

export interface FacetBaseMeta {
    facetId: string;
    facetField: string;
    facetTitle: string;
}

export interface FacetMetadata extends FacetBaseMeta {
    facetValue: string;
}

export interface FacetRangeMetadata extends FacetBaseMeta {
    facetRangeStart: string;
    facetRangeEnd: string;
}

export interface FacetSortMeta extends FacetBaseMeta {
    criteria: string;
}

export interface QueryErrorMeta {
    query: string;
    aq: string;
    cq: string;
    dq: string;
    errorType: string;
    errorMessage: string;
}

export enum SmartSnippetFeedbackReason {
    DoesNotAnswer = 'does_not_answer',
    PartiallyAnswers = 'partially_answers',
    WasNotAQuestion = 'was_not_a_question',
    Other = 'other',
}

export interface SmartSnippetSuggestionMeta {
    contentIdKey: string;
    contentIdValue: string;
}

export type PartialDocumentInformation = Omit<DocumentInformation, 'actionCause' | 'searchQueryUid'>;
