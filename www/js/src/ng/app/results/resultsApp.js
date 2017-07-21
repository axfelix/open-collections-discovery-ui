// Search Results Module

// TICKETS: DL-495, DL-476, DL-477, DL-475, DL-125, DL-467,

define(function (require) {

    var templatePath = js_base_url + "ng/app/results/templates/";

    // ----- requireJS dependencies ------ //
    require('jquery', 'moreless');
    var angular = require('angular'),
        ngRoute = require('ngRoute'),
        ngAnimate = require('ngAnimate'),
        dlFacets = require('facets'),
        dlPagination = require('pagination'),
        dlSavedItems = require('savedItems'),
        dlAnimations = require('animations'),
        dlFilters = require('filters'),
        dlThumbs = require('thumbnails'),
        dlD3charts = require('d3onebar'),
        ngTranslate = require('pascalprecht.translate'),
        uiBootstrap = require('angularBootstrap'),

        dlServices = require('services/fieldService');
        dlServices = require('services/searchString');
        dlServices = require('services/esSearch');
        dlServices = require('services/collectionData');
        dlServices = require('services/responsive');
        dlServices = require('services/highlighter');


    // path to templates for directives

    var resultsApp = angular.module('resultsApp', [
            'ngRoute',
            'ngAnimate',
            // 'ngSanitize',
            'dlServices',
            'dlAnimations',
            'dlFilters',
            'dlFacets',
            'dlD3charts',
            'dlSavedItems',
            'dlPagination',
            'dlThumbs',
            'pascalprecht.translate',
            'ui.bootstrap',
        ],
        ['$locationProvider', function ($locationProvider) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        }],
        ['$routeProvider', function ($routeProvider) {
            reloadOnSearch(false);
        }]
    ).config(["$interpolateProvider", function ($interpolateProvider) {
            $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
        }]
    ).config(['$translateProvider', function ($translateProvider) {

        $translateProvider.translations('en', {
            'AFFILIATION': 'Affiliation',
            'APPLIED': 'applied',
            'CARL_ABRC': 'Canadian Association of Research Libraries',
            'CARL_ABRC_URL': 'http://www.carl-abrc.ca/',
            'CLEAR': 'Clear',
            'COMPUTE_CANADA': 'Compute Canada',
            'COMPUTE_CANADA_URL': 'https://www.computecanada.ca/',
            'DESCRIPTION': 'Description',
            'DETAILS': 'Details',
            'DETAILS_HIDE': '- Hide ',
            'DETAILS_SHOW': '+ Show ',
            'DISCOVERY_CREDIT': 'Discovery based on UBC Open Collections',
            'DRILL_DOWN': 'Drill-down',
            'DRILL_DOWN_DESC': 'Filter terms will be updated each time a filter is added, narrowing to reflect the new results each time.',
            'ERROR_NEED_JAVASCRIPT': 'This site requires JavaScript to function properly. Please enable JavaScript in your browser and try loading the page again.',
            'ERROR_NO_RESULTS': 'This search didn\'t return any matches. You might enter a different query, modify your filters, or try an advanced search.',
            'ERROR_GENERAL': 'There has been an error. Please try a different search.',
            'FACET': 'Facet',
            'FACET_CLEAR_FILTERS': 'Clear all filters',
            'FACET_DESC': 'All filter terms for the current search query will remain visible regardless filters added. Many filters can be added, but conflicting selections may yield no results.',
            'FACET_KEEP_FILTERS': 'Keep filters',
            'FILTER': 'filter',
            'FILTER_APPLY': 'Apply filter',
            'FILTER_RESULTS': 'Filter Results',
            'FILTERS_HIDE': 'Hide filters',
            'FILTERS_SHOW': 'Show filters',
            'FOUND': 'found',
            'ITEM_AUTHOR_UNKNOWN': 'Author Unknown',
            'ITEM_DESCRIPTION': 'Description',
            'ITEM_EMBARGOED': '<b>Embargoed</b>: Access by request only.',
            'KEYWORDS': 'Keywords',
            'LOAD_MORE': 'Load More',
            'MAINPAGE_ADVSEARCH_LINK': '/discover/html/adv-search.html?lang=en',
            'MAINPAGE_DESCRIPTION': 'A standalone version of the UBC Library Open Collections search results UI.',
            'MAINPAGE_HEADER': 'Research Discovery',
            'MAINPAGE_LOGO_ALT': 'FRDR-DFDR',
            'MAINPAGE_LOGO_LINK': mainpage_logo_link + '?locale=en',
            'MAINPAGE_LOGO_URL': '/discover/img/sitelogo_en.png',
            'MENU_ACCOUNT': 'Account',
            'MENU_ACCOUNT_ACTIVITY': 'View Transfers',
            'MENU_ACCOUNT_ADMIN': 'Admin',
            'MENU_ACCOUNT_GLOBUS': 'Globus Account',
            'MENU_ACCOUNT_LOGIN': 'Log In',
            'MENU_ACCOUNT_LOGIN_URL': '/repo/PublishDashboard',
            'MENU_ACCOUNT_LOGOUT': 'Log Out',
            'MENU_ACCOUNT_LOGOUT_URL': '/repo/logout',
            'MENU_FEEDBACK': 'Feedback',
            'MENU_FEEDBACK_URL': 'mailto:support@frdr.ca',
            'MENU_HELP': 'Help',
            'MENU_HELP_ABOUT': 'About',
            'MENU_HELP_ABOUT_URL': '/docs/en/about/',  
            'MENU_HELP_DOCUMENTATION': 'Documentation',
            'MENU_HELP_DOCUMENTATION_URL': '/docs/en/', 
            'MENU_HELP_GETACCOUNT': 'Get An Account',
            'MENU_HELP_GETACCOUNT_URL': '/docs/en/getting_an_account/',
            'MENU_HELP_SUPPORT': 'Contact Support',
            'MENU_HELP_SUPPORT_URL': '/docs/en/contact_support/',
            'MENU_HELP_TERMS': 'Terms of Service',
            'MENU_HELP_TERMS_URL': '/docs/en/terms_of_service/',
            'MENU_LOCALE': 'EN',
            'NO_RESULTS': 'No results found',
            'OF': 'of',
            'OPTIONS': 'Options',
            'PRIVACY_POLICY': 'Privacy Policy',
            'PRIVACY_POLICY_URL': '/docs/en/terms_of_service/',
            'PROGRAM': 'Program',
            'REDIRECTING': 'Redirecting to item...',
            'RESULT': 'result',
            'RESULTS_LOADING': 'Loading page-level results...',
            'RESULTS_ON_PAGES': 'Results on pages',
            'SCHOLARLY LEVEL': 'Scholarly level',
            'SEARCH_ADVANCED': 'Advanced Search',
            'SEARCH_ALL': 'Search all content',
            'SEARCH_LIMITED': 'Search cIRcle only',
            'SEARCH_RESULTS': 'Search Results',
            'SORT_OPTIONS_1': 'Sort by relevance',
            'SORT_OPTIONS_2': 'Sort by title A-Z',
            'SORT_OPTIONS_3': 'Sort by title Z-A',
            'SORT_OPTIONS_4': 'Sort by author A-Z',
            'SORT_OPTIONS_5': 'Sort by author Z-A',
            'SORT_OPTIONS_6': 'Sort by oldest to newest',
            'SORT_OPTIONS_7': 'Sort by newest to oldest',
            'SUBJECT': 'Subject',
            'TO': 'to',
            'TOGGLE_NAVIGATION': 'Toggle Navigation',
            'VIEW_OPTIONS_1': 'List view',
            'VIEW_OPTIONS_2': 'Detailed view',
            'VIEW_OPTIONS_3': 'Thumbnail view',
        });
             
        $translateProvider.translations('fr', {
            'AFFILIATION': 'Affiliation',
            'APPLIED': 'appliqué',
            'CARL_ABRC': 'Association des bibliothèques de recherche du Canada',
            'CARL_ABRC_URL': 'http://www.carl-abrc.ca/fr/',
            'CLEAR': 'Supprimer',
            'COMPUTE_CANADA': 'Calcul Canada',
            'COMPUTE_CANADA_URL': 'https://www.computecanada.ca/?lang=fr',
            'DESCRIPTION': 'Description',
            'DETAILS': 'Détails',
            'DETAILS_HIDE': '- Cacher ',
            'DETAILS_SHOW': '+ Montrer ',
            'DISCOVERY_CREDIT': 'Découverte basé sur UBC Open Collections',
            'DRILL_DOWN': 'Percer',
            'DRILL_DOWN_DESC': 'Filtrer les termes seront mis à jour chaque fois qu\'un filtre est ajouté, se rétrécissant pour refléter les nouveaux résultats à chaque fois.',
            'ERROR_NEED_JAVASCRIPT': 'Ce site nécessite JavaScript pour fonctionner correctement. Activez JavaScript dans votre navigateur et essayez de charger la page à nouveau.',
            'ERROR_NO_RESULTS': 'Cette recherche n\'a retourné aucune correspondance. Vous pouvez essayer une nouvelle recherche.',
            'ERROR_GENERAL': 'Il y a eu une erreur. Veuillez actualiser la page ou utiliser le bouton Précédent pour essayer une nouvelle recherche.',
            'FACET': 'Facette',
            'FACET_CLEAR_FILTERS': 'Supprimer les filtres',
            'FACET_DESC': 'Tous les termes de filtre pour la requête de recherche en cours resteront visibles, indépendamment des filtres ajoutés. De nombreux filtres peuvent être ajoutés, mais les sélections contradictoires peuvent donner aucun résultat.',
            'FACET_KEEP_FILTERS': 'Garder les filtres',
            'FILTER': 'filtre',
            'FILTER_APPLY': 'Appliquer filtre',
            'FILTER_RESULTS': 'Filtrer les résultats',
            'FILTERS_HIDE': 'Masquer les filtres',
            'FILTERS_SHOW': 'Afficher les filtres',
            'FOUND': 'trouvé',
            'ITEM_AUTHOR_UNKNOWN': 'Auteur Inconnu',
            'ITEM_DESCRIPTION': 'Description',
            'ITEM_EMBARGOED': '<b>Sous embargo</b>: Accès sur demande seulement.',
            'KEYWORDS': 'Mots clés',
            'LOAD_MORE': 'Montre plus',
            'MAINPAGE_ADVSEARCH_LINK': '/discover/html/adv-search.html?lang=fr',
            'MAINPAGE_DESCRIPTION': 'Une version autonome du UBC Library Open Collections résultats de recherche UI.',
            'MAINPAGE_HEADER': 'Découverte de la recherche',
            'MAINPAGE_LOGO_ALT': 'FRDR-DFDR',
            'MAINPAGE_LOGO_LINK': mainpage_logo_link + '?locale=fr',
            'MAINPAGE_LOGO_URL': '/discover/img/sitelogo_fr.png',
            'MENU_ACCOUNT': 'Compte',
            'MENU_ACCOUNT_ACTIVITY': 'Voir les transferts',
            'MENU_ACCOUNT_ADMIN': 'Admin',
            'MENU_ACCOUNT_GLOBUS': 'Compte Globus',
            'MENU_ACCOUNT_LOGIN': 'Se connecter',
            'MENU_ACCOUNT_LOGIN_URL': '/repo/PublishDashboard',
            'MENU_ACCOUNT_LOGOUT': 'Se déconnecter',
            'MENU_ACCOUNT_LOGOUT_URL': '/repo/logout',
            'MENU_FEEDBACK': 'Commentaires',
            'MENU_FEEDBACK_URL': 'mailto:support@frdr.ca',
            'MENU_HELP': 'Aider',
            'MENU_HELP_ABOUT': 'À propos de ce site',
            'MENU_HELP_ABOUT_URL': '/docs/fr/a_propos/',  
            'MENU_HELP_DOCUMENTATION': 'Documentation',
            'MENU_HELP_DOCUMENTATION_URL': '/docs/fr/',            
            'MENU_HELP_GETACCOUNT': 'Obtenez un compte',
            'MENU_HELP_GETACCOUNT_URL': '/docs/fr/obtenir_un_compte/',
            'MENU_HELP_SUPPORT': 'Contactez le support',
            'MENU_HELP_SUPPORT_URL': '/docs/fr/contactez_nous/',
            'MENU_HELP_TERMS': 'Conditions d\'utilisation',
            'MENU_HELP_TERMS_URL': '/docs/fr/conditions_d%27utilisation/',
            'MENU_LOCALE': 'FR',
            'NO_RESULTS': 'Aucun résultat trouvé',
            'OF': 'de',
            'OPTIONS': 'Options',
            'PRIVACY_POLICY': 'politique de confidentialité',
            'PRIVACY_POLICY_URL': '/docs/fr/conditions_d%27utilisation/',
            'PROGRAM': 'Programme',
            'REDIRECTING': 'Redirection vers l\'article...',
            'RESULT': 'résultat',
            'RESULTS_LOADING': 'Chargement des résultats de la page...',
            'RESULTS_ON_PAGES': 'Résultats sur les pages',
            'SCHOLARLY LEVEL': 'Niveau scolaire',
            'SEARCH_ADVANCED': 'Recherche avancée',
            'SEARCH_ALL': 'Rechercher tout le contenu',
            'SEARCH_LIMITED': 'Recherche cIRcle seulement',
            'SEARCH_RESULTS': 'Résultats de la recherche',
            'SORT_OPTIONS_1': 'Trier par pertinence',
            'SORT_OPTIONS_2': 'Trier par titre A-Z',
            'SORT_OPTIONS_3': 'Trier par titre Z-A',
            'SORT_OPTIONS_4': 'Trier par auteur A-Z',
            'SORT_OPTIONS_5': 'Trier par auteur Z-A',
            'SORT_OPTIONS_6': 'Trier par plus vieux à nouveau',
            'SORT_OPTIONS_7': 'Trier par plus nouveau à vieux',
            'SUBJECT': 'Sujet',
            'TO': 'à',
            'TOGGLE_NAVIGATION': 'Changer la navigation',
            'VIEW_OPTIONS_1': 'Vue liste',
            'VIEW_OPTIONS_2': 'Vue détaillée',
            'VIEW_OPTIONS_3': 'Vue vignette',
        });

        $translateProvider.useSanitizeValueStrategy('escape');            
    }]);

    resultsApp.boot = function () {
        angular.bootstrap(document, ['resultsApp']);
    };

    // UPDATE TEMPLATE CACHE (tCache service in services.js)
    resultsApp.run(['tCache', function (tCache) {
        tCache.clearCache();  // clear cache on dev
        tCache.templatePath = templatePath;
        tCache.getTemplates(['results-parent.html', 'results-list2.html', 'inner-results.html','mainpage-header.html','mainpage-footer.html','mainpage-search-options.html','mainpage-results-header.html']);
    }]);


    // SEARCH CONTROLLER
    // search functionality and routing
    //*******************************************************//
    resultsApp.controller('searchController',
        ['esSearchString',
            'esSearchService',
            '$scope',
            '$rootScope',
            '$location',
            '$window',
            'rExport',
            '$timeout',
            '$filter',
            'pageService',
            'collectionData',
            'max400',
            'highlighter',
            'facetService',
            'fieldService',
            'utility',
            '$translate',
            function (searchString, es, $scope, $rootScope, $location, $window, rExport, $timeout, $filter, pVars, collectionData, max400, highlighter, facetService, fieldService, utility,$translate) {
                $scope.rUpdating = true;
                // make sure fields mappings are loaded FIRST
                fieldService.getFields().then(function () {
                    // Go!
                    init();
                }, function (error) {
                    $scope.searchError = 'error';
                });

                var lucky = false;

                // Setup scoped stuff

                function init() {
                    // pre-load collections data (makes page load much faster)
                    collectionData.aggsSubsCols();
                    $scope.collectionList = [];
                    collectionData.getColsData().then(function(response){
                            $scope.collectionList = response.data;
                    });

                    // SET INITIAL VARS
                    $scope.total = undefined;
                    $scope.noTerms = false;
                    $scope.placeholder = 'Search for something!';
                    $scope.esr = {};
                    $scope.filterCount = searchString.filterCount;
                    $scope.pageRange = [0];

                    //view options
                    $scope.rViewOptions = [
                        {"index": 0, "label": "List view",      "perPage": 20}, 
                        {"index": 1, "label": "Detailed view",  "perPage": 20}, 
                        /* {"index": 2, "label": "Thumbnail view", "perPage": 60}, */
                    ];

                    //sort options
                    $scope.rSortOptions = [
                        {"index": 0, "label": "Sort by relevance",     "field": false,      "order": "desc" }, 
                        {"index": 1, "label": "sort by title A-Z",     "field": "title",    "order" : "asc" }, 
                        {"index": 2, "label": "Sort by title Z-A",     "field": "title",    "order": "desc" }, 
                        {"index": 3, "label": "Sort by author A-Z",    "field": "author",  "order": "asc"  }, 
                        {"index": 4, "label": "Sort by author Z-A",    "field": "author",  "order": "desc" }, 
                        {"index": 5, "label": "Sort oldest to newest", "field": "sortDate", "order": "asc"  }, 
                        {"index": 6, "label": "Sort newest to oldest", "field": "sortDate", "order": "desc" },
                    ];

                    // UPDATE SEARCH BASED ON INITIAL VARS TO START APP
                    //*******************************************************//
                    // all new searches are triggered by changing url location

                    // INITIALIZE
                    getLocation(updateSearch);
                    // UPDATE ON LOCATION CHANGE
                    $scope.$on('$locationChangeSuccess', function () {
                        if ($location.path().startsWith('/discover/') ) {
                            getLocation(updateSearch);
                        } else {
                            $window.location.href = $location.url();
                        }
                    });

                    // INITIALIZE SCOPE FUNCTIONS
                    //*******************************************************//
                    //SEARCH FUNCTIONS
                    $scope.newSearch = function newSearch() {
                        $scope.q = $scope.terms;
                        // console.log('NEW SEARCH', 'keep filters:', searchString.keepFilters);
                        // reset page number
                        $scope.currentPage = 0;
                        $scope.hidePages = true;
                        // keep filters?
                        if (searchString.keepFilters === false) {
                            facetService.clearFiltersNow();
                            updateLocation();
                        } else {
                            updateLocation();
                        }
                    };

                    $scope.updateSearch = function updateSearch(category) {
                        // catch GA interactions
                        if (category) {
                            if (category === 'sort') {
                                utility.gaEvent('search_results', 'sort_change', $scope.rSort.label);
                            } else if (category === 'view') {
                                utility.gaEvent('search_results', 'view_change', $scope.resultsView.label);
                            }
                        }
                        // update URL string
                        updateLocation();
                    };

                    $scope.modifySearch = function modifySearch() {
                        // console.log('MODIFY SEARCH');
                        $scope.currentPage = 0;
                        updateLocation();
                    };

                    // modify search on facet
                    facetService.changed($scope.modifySearch);

                    // Update language when user clicks language link
                    $scope.changeLanguage = function (langKey) {
                        var currentLang = $translate.use();
                        $translate.use(langKey);
                        $scope.language = langKey;
                        if (currentLang != langKey) {
                            updateLocation();
                        }
                    };

                    // update facets & searchString on switch between cIRcle / all content
                    $scope.dspChange = function () {
                        utility.gaEvent('search_results', 'circle_only_radio', $scope.dspOnly);
                        searchString.dspOnly = $scope.dspOnly;
                        facetService.clearFiltersNow();
                        $scope.modifySearch();
                    };

                    // update search on pagination change
                    // uses jQuery .. make sure it's loaded
                    pVars.changed(function () {
                        $scope.currentPage = pVars.currentPage;
                        updateLocation();
                        try {
                            if ($(window).scrollTop() > 800) {
                                $(window).scrollTop(0);
                            }
                        } catch (e) {
                            console.error(e, 'probably no jquery');
                        }
                    });

                    // Filter Actions
                    $scope.clearAllFilters = function () {
                        facetService.clearFiltersNow();
                        $scope.modifySearch();
                    };
                    $scope.addFilter = function (f, t) {
                        utility.gaEvent('search_results', 'add_filter', f);
                        var term = $filter('stripHtmlTags')(t);
                        var index = searchString.vars.filter[f].terms.indexOf(term);
                        // console.log('toggle filter', f, term, index);
                        if (index === -1) {
                            searchString.vars.filter[f].terms.push(term);
                        }
                        $scope.modifySearch();
                        // if $apply did not already get called, do it (needed for passUp from d3 directives)
                        if (!$scope.$$phase) $scope.$apply();
                    };

                    // pass data from child directives (d3 clicks)
                    $scope.passUp = function (obj) {
                        if (obj.act !== 'filter') {
                            return;
                        }
                        $scope.addFilter(obj.key, obj.term);

                    };

                    // responsive listener for small screens
                    // this is used in the results list to prevent thumbnails from loading when they aren't visible.
                    max400.watch();
                    max400.ismatch(function () {
                        $scope.max400 = true;
                        // console.log('MAX 400 TRUE');
                    });
                    max400.notmatch(function () {
                        $scope.max400 = false;
                        // console.log('MAX 400 FALSE');
                    });
                }  //-- end init();

                // APP FUNCTIONS
                //*******************************************************//
                // track number of search updates to make sure facets fire on pageload
                var searchCounter = 0;
                // var fireFacets = true;
                // Search elasticSearch / send new search parameters to search services
                function updateSearch(callback) {
                    //update filter count
                    searchString.updateCount();
                    $scope.filterCount = searchString.filterCount;
                    if(facetService.fBehavior === 'expand') {
                        searchString.filterExecution = 'or';
                    } else {
                        searchString.filterExecution = 'and';
                    }
                    // should facets fire?
                    if (searchCounter === 0 || $scope.q !== searchString.vars.query) {
                        $rootScope.facetsLoaded = false;
                    } else {
                        $rootScope.facetsLoaded = true;
                    }
                    $scope.searchError = false;
                    $scope.rUpdating = true;

                    //update search string
                    searchString.vars.query = $scope.q;
                    searchString.vars.lang = $scope.language;
                    searchString.vars.sort = {field: $scope.rSort.field, order: $scope.rSort.order};
                    searchString.dspOnly = $scope.dspOnly;

                    //update search box
                    $scope.terms = $scope.terms || $scope.q;

                    // update page vars
                    pVars.perPage = $scope.resultsView.perPage;
                    pVars.update();

                    //update highlighting terms
                    highlighter.getTerms();

                    if (website_env !== 'prod') {
                        //console.log("searchString", searchString);
                    }

                    //define search input, THEN do search
                    // remove string option when stringify can be removed.
                    searchString.makeString().then(function (response) {
                        var searchInput = {
                            from: pVars.from || 0,
                            size: pVars.perPage,
                            body: response
                        };
                        es.search(searchInput).then(function (response) {
                            if (response.error) {
                                $scope.rUpdating = false;
                                $scope.searchError = 'error';
                                $scope.total = 0;
                                $scope.esr = {};
                            } else {
                                searchCounter++;
                                $scope.rUpdating = false;
                                // fire facet queries
                                facetService.newFacetQuery($scope.q);
                                // typedata for onebar used at top of search results
                                $scope.typeData = "";
                                // update results
                                $scope.esr = {
                                    results: response.results
                                };
                                $scope.total = response.total;
                                $scope.hidePages = false;
                                if (!$scope.terms) {
                                    $scope.terms = $scope.q || $scope.placeholder;
                                }
                                // update pagination vars
                                if (pVars.total != $scope.total) {
                                    pVars.total = $scope.total;
                                }
                            }
                        }, function (error) {
                            $scope.rUpdating = false;
                            $scope.searchError = error;
                            $scope.total = 0;
                            $scope.esr = {};
                        });
                    });

                    typeof callback == 'function' && callback();

                }            

                // update URL
                function updateLocation(callback) {
                    utility.windowstop();
                    // get dates from obj
                    var beginKey = '', endKey = '';
                    // console.log(searchString.vars.filter.sortDate);
                    if (searchString.vars.filter.sortDate.begin && searchString.vars.filter.sortDate.end) {
                        beginKey = searchString.vars.filter.sortDate.begin.key;
                        endKey = searchString.vars.filter.sortDate.end.key;
                    }

                    var locObj = {
                        'q': encodeURIComponent($scope.q),
                        'p': $scope.currentPage,
                        'sort': $scope.rSort.index,
                        'view': $scope.resultsView.index,
                        //'circle': $scope.dspOnly,
                        'lang': $scope.language,

                        'dBegin': beginKey,
                        'dEnd': endKey,

                        // add searchcounter to trigger new searches on same query string
                        'c': searchCounter
                    };

                    // add filters
                    for (var f in searchString.vars.filter) {
                        if (f !== 'sortDate' && searchString.vars.filter[f].terms) {
                            locObj[f] = searchString.vars.filter[f].terms;
                        }
                    }
                    $location.search(locObj);
                    // log as pageview in GA
                    // note: this starts as of Apr 2016, previous analytics will be skewed light on searches
                    utility.gaPageview($location.url());
                    typeof callback == 'function' && callback();
                }

                // get URL string data
                function getLocation(callback) {
                    var locSearch = $location.search();
                    // get current page
                    $scope.currentPage = Number(locSearch.p) || 0;
                    pVars.currentPage = Number(locSearch.p) || 0;
                    // get view
                    $scope.resultsView = $scope.rViewOptions[Number(locSearch.view) || 0];
                    $scope.rSort = $scope.rSortOptions[Number(locSearch.sort) || 0];
                    // get search type
                    $scope.dspOnly = locSearch.circle || "n";
                    // make scope.q natural string so that ES doesn't get thrown off by plusses
                    // $scope.q = searchString.makeNaturalStr(locSearch.q) || '*';
                    $scope.q = decodeURIComponent(locSearch.q) || '*';
                    //get query
                    $scope.terms = $scope.q;
                    //get language
                    $scope.language = locSearch.lang || "en";
                    $translate.use($scope.language);
                    // Setup RSS LINK
                    $scope.rssLink = website_base_url + "/rss/search/rss.xml?q=" + encodeURIComponent($scope.q) + "&sort=" + $scope.rSort.index + "&circle=" + $scope.dspOnly;
                    // get filters
                    angular.forEach(searchString.vars.filter, function (v, key) {
                        // var decodedKey = decodeURIComponent(key);
                        searchString.vars.filter[key].terms = getLocFilters(key);
                        if (searchString.vars.filter[key].terms.length > 0) {
                            $scope.rssLink = $scope.rssLink + "&" + key + "=" + encodeURIComponent(searchString.vars.filter[key].terms.join('~@~'));
                        }
                    });
                    // is this initiated by a search widget? log it.
                    if (locSearch.widgetquery) {
                        utility.gaEvent('search_results', 'widget_query', locSearch.widgetquery);
                    }
                    // get date begin/end
                    if (locSearch.dBegin && locSearch.dEnd) {
                        // console.log('add date filters!', locSearch.dBegin, locSearch.dEnd);
                        searchString.vars.filter.sortDate.begin = {
                            key: locSearch.dBegin,
                            display: $filter('date')(locSearch.dBegin, 'yyyy')
                        };
                        searchString.vars.filter.sortDate.end = {
                            key: locSearch.dEnd,
                            display: $filter('date')(locSearch.dEnd, 'yyyy')
                        };
                        $scope.rssLink = $scope.rssLink + '&dBegin=' + locSearch.dBegin + '&dEnd=' + locSearch.dEnd;
                    }

                    $translate('VIEW_OPTIONS_1').then(function(t) { $scope.rViewOptions[0]['label'] = t; })
                    $translate('VIEW_OPTIONS_2').then(function(t) { $scope.rViewOptions[1]['label'] = t; })
                    //$translate('VIEW_OPTIONS_3').then(function(t) { $scope.rViewOptions[2]['label'] = t; })
                    $translate('SORT_OPTIONS_1').then(function(t) { $scope.rSortOptions[0]['label'] = t; })
                    $translate('SORT_OPTIONS_2').then(function(t) { $scope.rSortOptions[1]['label'] = t; })
                    $translate('SORT_OPTIONS_3').then(function(t) { $scope.rSortOptions[2]['label'] = t; })
                    $translate('SORT_OPTIONS_4').then(function(t) { $scope.rSortOptions[3]['label'] = t; })
                    $translate('SORT_OPTIONS_5').then(function(t) { $scope.rSortOptions[4]['label'] = t; })
                    $translate('SORT_OPTIONS_6').then(function(t) { $scope.rSortOptions[5]['label'] = t; })
                    $translate('SORT_OPTIONS_7').then(function(t) { $scope.rSortOptions[6]['label'] = t; })

                    function getLocFilters(loc) {
                        var output = [];
                        var input = locSearch[loc];
                        if (input === undefined || input === 'none' || input.length < 1) {
                            // console.log('locfilters no iput');
                            return [];
                        } else {
                            if (input instanceof Array) {
                                for (var i = 0; i < input.length; i++) {
                                    output.push(decodeURIComponent(input[i]));
                                }
                            } else {
                                output.push(decodeURIComponent(input));
                            }
                            // console.log('locfilters ouput!', output);
                            return output;
                        }
                    }

                    typeof callback == 'function' && callback();
                }
            }
        ])

    // RESULTS CONTROLLER
    // child scope & view for each search result
    //*******************************************************//
        .controller('resultController', [
            '$scope',
            // 'esSearchService',
            // 'i8',
            'esSearchString',
            // '$sce',
            'rExport',
            'collectionData',
            '$http',
            '$filter',
            'highlighter',
            'fieldService',
            'utility',
            function ($scope,
                      // es,
                      searchString,
                      // $sce,
                      rExport,
                      collectionData,
                      $http,
                      $filter,
                      highlighter,
                      fieldService,
                      utility) {

                var query = searchString.vars.query;
                $scope.base_url = website_base_url;
                // check view
                // detailed view
                // console.log($scope.resultsView.index)
                if ($scope.resultsView.index === 1) {
                    $scope.detailView = true;
                    $scope.details = true;
                }

                // get field mappings from fieldservice (promise)
                fieldService.getFields(fieldService.resultsFields).then(function (response) {
                    setR(response);
                });

                function setR(rFields) {

                    var hasFields = function () {
                        var arr = [];
                        for (var prop in $scope.r) {
                            for (var p in rFields) {
                                if (rFields[p].map === prop) {
                                    arr.push(p);
                                }
                            }
                        }
                        return arr;
                    }();

                    // set required / special field vals
                    /* FRDR
                    $scope.r = {
                        // app vars
                        _id: $scope.r._id,
                        repo: source[rFields.repo.map],
                        compound: $scope.r.fields.is_compound[0],
                        saved: rExport.isSaved($scope.r._id),
                        nick: utility.mustBeString($scope.r._source[rFields.nick.map]),
                        handle: source[rFields.handle.map],
                        // default view
                        title: highlighter.highlight(singleVal(source[rFields.title.map])),
                        sortDate: highlighter.highlight($filter('formatSortDate')(source[rFields.sortDate.map])),
                        author: highlighter.highlight(source[rFields.author.map]),
                        type: (source[rFields.type.map]) ? source[rFields.type.map][0] : undefined,
                        // special cases
                        embargoed: (source[rFields.repo.map] === 'dsp') ? (checkEmbargo(source[rFields.dateAvailable.map])) : false,
                        // details object (filled below)
                        detail: {}
                    };
                    */

                    $scope.r._id = $scope.r.source;
                    $scope.r.author = highlighter.highlight($scope.r['contributor.author']);
                    $scope.r.collection = $scope.r['origin.id'];
                    $scope.r.description = highlighter.highlight(singleVal($scope.r.description,"Description"));                    
                    $scope.r.detail = {};
                    $scope.r.handle = $scope.r.source;
                    $scope.r.icon_url = $scope.r['https://frdr.ca/schema/1.0#origin.icon'];
                    $scope.r.nick = $scope.r.collection;
                    $scope.r.repo = $scope.r.collection;
                    $scope.r.repo_url = "";
                    $scope.r.saved = rExport.isSaved($scope.r._id);
                    $scope.r.saved = rExport.isSaved($scope.r._id);
                    $scope.r.sortDate = $scope.r.date;
                    $scope.r.title = highlighter.highlight(singleVal($scope.r.title,"Title"));
                    $scope.r.type = "text";
                    $scope.r.type = singleVal($scope.r['resourceTypeGeneral'],"Type");

                    // Check for icon overrides in the collection definitions
                    for (var i=0; i < $scope.collectionList.length; i++) {
                        if ($scope.r.collection == $scope.collectionList[i].val ) {
                            if ($scope.collectionList[i].hasOwnProperty("icon_url") && $scope.collectionList[i].icon_url != "") {
                                $scope.r.icon_url = $scope.collectionList[i].icon_url;
                            }
                            if ($scope.collectionList[i].hasOwnProperty("repo_url")) {
                                $scope.r.repo_url = $scope.collectionList[i].repo_url;
                            }
                        }
                    }

                    // add detail view for ALL fields, only if details visible
                    var detailsParsed = false;
                    var fieldsToHide = { 
                        "_id":1,"origin.icon":1,"origin.id":1,"saved":1,"detail":1,"repo_url":1,"resourceTypeGeneral":1,
                        "contributor.author":1,"icon_url":1,"series":1, "http://nrdr-ednr.ca/schema/1.0#origin.id": 1
                    }
                    function makeArray(o){ if (!angular.isArray(o)) { return [o]; } else { return o;}  }
                    function parseDetails() {
                        for (var key in $scope.r) {
                           if ($scope.r.hasOwnProperty(key) && !fieldsToHide.hasOwnProperty(key)) {
                              if (rFields.hasOwnProperty(key)) {
                                  $scope.r.detail[key] = {
                                      field: key,
                                      label: rFields[key].label,
                                      val: makeArray($scope.r[rFields[key].map]),
                                      facetField: facetable(key)
                                  }
                              } else {
                                  $scope.r.detail[key] = {
                                      field: key,
                                      label: key,
                                      val: makeArray($scope.r[key]),
                                      facetField: facetable(key)
                                  }
                              }
                           }
                        }
                        detailsParsed = true;
                    }

                    if ($scope.details) {
                        parseDetails();
                    }

                    // toggle detailed list view
                    $scope.toggleDetails = function () {
                        if ($scope.details) {
                            $scope.details = false;
                        } else {
                            if (!detailsParsed) {
                                parseDetails();
                            }
                            if (!$scope.innerContent) {
                                getInnerResults();
                            }
                            $scope.details = true;
                        }
                    };

                    //check if field is facetable
                    function facetable(check) {
                        return fieldService.facetFields.indexOf(check) !== -1 ? true : false;
                    }

                    // make sure single val exists for required fields
                    function singleVal(check, fieldname) {
                        if (check) {
                            return check;
                        } else {
                            return '[' + fieldname + ' unknown]';
                        }
                    }

                    // check if embargoed
                    function checkEmbargo(input) {
                        if (!input) return false;
                        var today = new Date(), eDate = new Date(input);
                        // console.log('input:', input, 'eDate:', eDate, 'today:', today);
                        return ((eDate >= today) ? true : false);
                    }

                    // get correct collection data and hyperlinks
                    collectionData.getTitle($scope.r.nick).then(function (response) {
                        // set collection name
                        var nick = (response && response.nick) ? response.nick : $scope.r.nick;
                        // set item link
                        if ($scope.r.nick != nick) {
                            $scope.r.itemLink = 'collections/' + nick + '/' + $scope.r.nick + '/items/' + $scope.r._id;
                        }
                        else if ($scope.r.repo == 'dsp') {
                            $scope.r.itemLink = 'cIRcle/collections/' + nick + '/items/' + $scope.r._id;
                        }
                        else {
                            $scope.r.itemLink = 'collections/' + nick + '/items/' + $scope.r._id;
                        }
                        // if compound object, add search query string to url for viewer
                        if ($scope.r.compound) {
                            $scope.r.itemLink = $scope.r.itemLink.concat('#p0z-10000r0f:' + encodeURIComponent(searchString.vars.query));
                        }
                        // set collection link
                        $scope.r.collectionLink = 'collections/' + nick;
                    });

                    // load page level results for compound objects (if showing details)
                    if ($scope.r.compound && $scope.details) {
                        getInnerResults();
                    }
                    function getInnerResults() {
                        // if empty query, then set compound to false because in-text searching is useless (hides the whole thing)
                        //if (query === '*') {
                            $scope.r.compound = false;
                            return;
                        //}

                        var dashedId = $scope.r._id.replace(/\./g, "-");
                        var newHandle = $scope.r.repo + "." + $scope.r.nick + "." + dashedId;
                        // otherwise do in text search:
                        // var iiifUrl = iiif_api +'/'+ $scope.r.repo + "." + $scope.r.nick + "." + dashedId + '&search=' + encodeURIComponent(query) + '&json';
                        var iiifUrl = iiif_api + '/viewer/excerpt.php?handle=' + newHandle + '&search=' + encodeURIComponent(query) + '&json';
                        $http.get(iiifUrl).then(function (response) {
                            if (website_env !== 'prod') {
                                //console.log('inner response', response.data);
                            }

                            if (!response.data) {
                                $scope.innerContent = {
                                    error: true
                                }
                            } else if (response.data.error) {
                                $scope.innerContent = {
                                    error: true,
                                    pData: response.data
                                };
                            } else {
                                var pages = [];
                                for (var i in response.data) {
                                    var p = {page: parseInt(i) + 1, index: i};
                                    pages.push(p);
                                    response.data[i].pI = i;
                                }
                                $scope.innerContent = {
                                    error: false,
                                    query: query,
                                    handle: newHandle,
                                    pages: pages,
                                    pData: response.data
                                };

                            }
                            // console.log($scope.innerContent);
                        }, function (error) {
                            // console.log('inner data error', error);
                            $scope.innerContent = {
                                error: true
                            }
                        });

                    }
                }

                // SAVE RESULT TO FOLDER
                $scope.saveResult = function (r) {
                    $scope.r.saved = rExport.save(r);
                };
                $scope.$watch(function () {
                    return rExport.saved;
                }, function (val) {
                    $scope.r.saved = rExport.isSaved($scope.r._id);
                });
            }
        ]);


    /************** RESULTS DIRECTIVES *****************/
    // parent
    resultsApp.directive('resultsView', function () {
        return {
            restrict: 'EA',
            templateUrl: templatePath + 'results-parent.html?version=' + app_version,
        };
    })

    //views
        .directive('resultsList', function () {
            function link(scope, element, attrs) {
                var btn = element.find('.dl-r-more'),
                    hide = element.find('.dl-r-metadata-table');
                hide.simpleSlide(btn);
            }

            return {
                restrict: 'A',
                templateUrl: templatePath + 'results-list2.html?version=' + app_version,
                link: link
            };
        })
        .directive('sidebarShow', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.on('click', function () {
                        $('#cols-wrap').sidebar({'toggle': true});
                    });
                }
            };
        })
        .directive('mainpageSearchOptions', function () {
            return {
                restrict: 'E',
                templateUrl: templatePath + 'mainpage-search-options.html?version=' + app_version,
            };
        })
        .directive('mainpageResultsHeader', function () {
            return {
                restrict: 'E',
                templateUrl: templatePath + 'mainpage-results-header.html?version=' + app_version,
            };
        })

        .directive('mainpageHeader', function () {
            return {
                restrict: 'E',
                templateUrl: templatePath + 'mainpage-header.html?version=' + app_version,
            };
        })

        .directive('mainpageFooter', function () {
            return {
                restrict: 'E',
                templateUrl: templatePath + 'mainpage-footer.html?version=' + app_version,
            };
        })

        // INNER RESULTS DIRECTIVES
        .directive('innerResults', ["utility", function (utility) {
            return {
                restrict: 'EA',
                templateUrl: templatePath + 'inner-results.html?version=' + app_version,
                scope: {data: '='},
                controller: ["$scope", function ($scope) {
                    if ($scope.data.error) {
                        $scope.innerError = true;
                    } else {
                        $scope.currentPi = $scope.data.pages[0].index;
                        $scope.pClick = function (pi) {
                            if ($scope.currentPi === pi) {
                                utility.gaEvent('search_results', 'inner_result', 'clickthrough');
                                var split = $scope.data.pData[pi].access.split(':');
                                document.location = split.join(':');
                            } else {
                                $scope.currentPi = pi;
                            }
                        };

                    }
                }]
            };
        }])
        // only show highlight divs after images have loaded
        .directive('hlonload', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.bind('load', function () {
                        $(this).css('background', 'none').nextAll('.highlight').css('visibility', 'visible');
                    });
                }
            };
        });

    return resultsApp;
});
