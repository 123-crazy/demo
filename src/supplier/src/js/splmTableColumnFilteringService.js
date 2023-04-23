/* eslint-disable complexity */
// Copyright (c) 2020 Siemens

/**
 * @module js/splmTableColumnFilteringService
 */
 import _ from 'lodash';

 /**
  * This function is responsible for handling filtering and pagination of the data.
  * In real world applications this will be a server side logic. The current client
  * side processing here is to serve as an example
  *
  * @param {ObjectArray} response response from GET call
  * @param {ObjectArray} columnFilters column filters
  * @param {Object} sortCriteria Sort criteria
  * @param {int} startIndex start index for pagination
  * @param {int} pageSize Total number of rows to return for pagination
  *
  * @return {ObjectArray}  paginated filtered result
  */
 export let applySortAndFilterRows = function( response, columnFilters, sortCriteria, startIndex, pageSize ) {
     var countries = response.data.countries;
     if( columnFilters ) {
         // Apply filtering
         _.forEach( columnFilters, function( columnFilter ) {
             countries = createFilters( columnFilter, countries );
         } );
     }
 
     // Apply sort
     if( sortCriteria && sortCriteria.length > 0 ) {
         var criteria = sortCriteria[ 0 ];
         var sortDirection = criteria.sortDirection;
         var sortColName = criteria.fieldName;
 
         if( sortDirection === 'ASC' ) {
             countries.sort( function( a, b ) {
                 if( a.props[ sortColName ].value <= b.props[ sortColName ].value ) {
                     return -1;
                 }
 
                 return 1;
             } );
         } else if( sortDirection === 'DESC' ) {
             countries.sort( function( a, b ) {
                 if( a.props[ sortColName ].value >= b.props[ sortColName ].value ) {
                     return -1;
                 }
 
                 return 1;
             } );
         }
     }
 
     var endIndex = startIndex + pageSize;
 
     return countries.slice( startIndex, endIndex );
 };
 
 /**
  * This function mocks the server response for the getFilterFacets action and should not
  * be implemented on client. It mocks the server filtering
  *
  * @param {Object} response - The data to filter
  * @param {Object} columnFilters - existing column filters
  * @param {Object} fullData - contains the column menu's temporary filter data to refine facets
  * @returns {Object} The facet data to display
  */
 export let getFilterFacets = function( response, columnFilters, fullData ) {
     var countries = response.data.countries;
     var updateFilters = fullData.columnFilters;
     var columnName = fullData.column.name;
     var facetValues = {
         values: [],
         totalFound: 0
     };
 
     // This mocks the server filtering data using existing column filters
     if( columnFilters ) {
         // Apply filtering
         _.forEach( columnFilters, function( columnFilter ) {
             if( columnName !== columnFilter.columnName ) {
                 countries = createFilters( columnFilter, countries );
             }
         } );
     }
 
     // This is mocking the server filtering data using temporary information on the individual column menu
     if( updateFilters ) {
         _.forEach( updateFilters, function( columnFilter ) {
             countries = createFilters( columnFilter, countries );
         } );
     }
 
     var facetsToReturn = [];
 
     _.forEach( countries, function( country ) {
         if( country.props[ columnName ].displayValue ) {
             facetsToReturn.push( country.props[ columnName ].displayValue );
         } else if( country.props[ columnName ].displayValues ) {
             _.forEach( country.props[ columnName ].displayValues, function( value ) {
                 facetsToReturn.push( value );
             } );
         } else {
             facetsToReturn.push( '' );
         }
     } );
 
     facetsToReturn = _.uniq( facetsToReturn );
 
     facetValues.totalFound = facetsToReturn.length;
 
     var startIndex = fullData.startIndex;
     var endIndex = startIndex + fullData.maxToReturn;
 
     facetsToReturn = facetsToReturn.slice( startIndex, endIndex + 1 );
 
     facetValues.values = facetsToReturn;
 
     return facetValues;
 };
 
 /**
  * This function is intentionally serving as a bypass function to set the column filters
  * on data section. In real world applications, this should not be needed as getting data based on column
  * filter facets will happen on the server. Since showcase doesn't have any backend, we are splitting
  * the logic into two functions.
  *
  * @param {Object} fullData - The current column menu filter data to refine facets
  * @returns {Object} the current column menu filter data
  */
 export let getFilterFacetData = function( fullData ) {
     return fullData;
 };
 
 /**
  * This function mocks the server logic for filtering text data with the 'Contains' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 let processContainsFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         if( country.props[ columnFilter.columnName ].uiValue ) {
             return country.props[ columnFilter.columnName ].uiValue.toLowerCase().includes( columnFilter.values[ 0 ].toLowerCase() );
         } else if( country.props[ columnFilter.columnName ].uiValues ) {
             return country.props[ columnFilter.columnName ].uiValues.toString().toLowerCase().includes( columnFilter.values[ 0 ].toLowerCase() );
         }
     } );
 };
 
 /**
  * This function mocks the server logic for filtering text data with the 'Does not contain' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 let processNotContainsFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         if( country.props[ columnFilter.columnName ].uiValue ) {
             return !country.props[ columnFilter.columnName ].uiValue.toLowerCase().includes( columnFilter.values[ 0 ].toLowerCase() );
         } else if( country.props[ columnFilter.columnName ].uiValues ) {
             return !country.props[ columnFilter.columnName ].uiValues.toString().toLowerCase().includes( columnFilter.values[ 0 ].toLowerCase() );
         }
     } );
 };
 
 /**
  * This function mocks the server logic for filtering text data with the 'Begins with' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 let processStartsWithFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         if( country.props[ columnFilter.columnName ].uiValue ) {
             return country.props[ columnFilter.columnName ].uiValue.toLowerCase().startsWith( columnFilter.values[ 0 ].toLowerCase() );
         } else if( country.props[ columnFilter.columnName ].uiValues ) {
             return country.props[ columnFilter.columnName ].uiValues[0].toLowerCase().startsWith( columnFilter.values[ 0 ].toLowerCase() );
         }
     } );
 };
 
 /**
  * This function mocks the server logic for filtering text data with the 'Ends with' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 const processEndsWithFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         if( country.props[ columnFilter.columnName ].uiValue ) {
             return country.props[ columnFilter.columnName ].uiValue.toLowerCase().endsWith( columnFilter.values[ 0 ].toLowerCase() );
         } else if( country.props[ columnFilter.columnName ].uiValues ) {
             return country.props[ columnFilter.columnName ].uiValues[0].toLowerCase().endsWith( columnFilter.values[ 0 ].toLowerCase() );
         }
     } );
 };
 
 /**
  * This function mocks the server logic for filtering numeric data with the 'Range' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 const processNumericRangeFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         var fromValue = columnFilter.values[ 0 ];
         var toValue = columnFilter.values[ 1 ];
         if( !fromValue ) {
             fromValue = 0;
         }
         return country.props[ columnFilter.columnName ].value >= Number( fromValue ) && country.props[ columnFilter.columnName ].value <= Number( toValue );
     } );
 };
 
 /**
  * This function mocks the server logic for filtering date data with the 'Range' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 const processDateRangeFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         var fromValue = columnFilter.values[ 0 ];
         var toValue = columnFilter.values[ 1 ];
         var fromDate = new Date( fromValue );
         var toDate = new Date( toValue );
         return country.props[ columnFilter.columnName ].value >= fromDate.getTime() && country.props[ columnFilter.columnName ].value <= toDate.getTime();
     } );
 };
 
 /**
  * This function mocks the server logic for filtering numeric data with the 'Greater than' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 let processGreaterThanFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         if( country.props[ columnFilter.columnName ].value && country.props[ columnFilter.columnName ].value > Number( columnFilter.values[ 0 ] ) ) {
             return true;
         }
         if( country.props[ columnFilter.columnName ].uiValue === '0' && Number( country.props[ columnFilter.columnName ].uiValue ) > Number( columnFilter.values[ 0 ] ) ) {
             return true;
         }
     } );
 };
 
 /**
  * This function mocks the server logic for filtering numeric data with the 'Less than' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 let processLessThanFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         if( country.props[ columnFilter.columnName ].value && country.props[ columnFilter.columnName ].value < Number( columnFilter.values[ 0 ] ) ) {
             return true;
         }
         if( country.props[ columnFilter.columnName ].uiValue === '0' && Number( country.props[ columnFilter.columnName ].uiValue ) < Number( columnFilter.values[ 0 ] ) ) {
             return true;
         }
     } );
 };
 
 /**
  * This function mocks the server logic for filtering numeric data with the 'Greater than or equals' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 const processGreaterThanEqualsNumericFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         if( country.props[ columnFilter.columnName ].value >= Number( columnFilter.values[ 0 ] ) ) {
             return true;
         }
         if( country.props[ columnFilter.columnName ].uiValue === '0' && Number( country.props[ columnFilter.columnName ].uiValue ) >= Number( columnFilter.values[ 0 ] ) ) {
             return true;
         }
     } );
 };
 
 /**
  * This function mocks the server logic for filtering date data with the 'Greater than or equals' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 const processGreaterThanEqualsDateFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         var filterDateValue = new Date( columnFilter.values[ 0 ] );
         var countryDateValue = new Date( country.props[ columnFilter.columnName ].uiValue );
         if( countryDateValue.getTime() >= filterDateValue.getTime() ) {
             return true;
         }
     } );
 };
 
 /**
  * This function mocks the server logic for filtering numeric data with the 'Less than or equals' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 const processLessThanEqualsNumericFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         if( country.props[ columnFilter.columnName ].value <= Number( columnFilter.values[ 0 ] ) && country.props[ columnFilter.columnName ].uiValue !== '' ) {
             return true;
         }
         if( country.props[ columnFilter.columnName ].uiValue === '0' && Number( country.props[ columnFilter.columnName ].uiValue ) <= Number( columnFilter.values[ 0 ] ) ) {
             return true;
         }
     } );
 };
 
 /**
  * This function mocks the server logic for filtering date data with the 'Less than or equals' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 const processLessThanEqualsDateFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         var filterDateValue = new Date( columnFilter.values[ 0 ] );
         var countryDateValue = new Date( country.props[ columnFilter.columnName ].uiValue );
         if( countryDateValue.getTime() <= filterDateValue.getTime() ) {
             return true;
         }
     } );
 };
 
 /**
  * This function mocks the server logic for filtering numeric data with the 'Equals' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 const processEqualsNumericFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         for( var i = 0; i < columnFilter.values.length; i++ ) {
             if( country.props[ columnFilter.columnName ].value === null && columnFilter.values[ i ] === '' ) {
                 return true;
             }
             if( country.props[ columnFilter.columnName ].uiValue !== '0' ) {
                 if( country.props[ columnFilter.columnName ].uiValue === columnFilter.values[ i ] || country.props[ columnFilter.columnName ].value === Number( columnFilter.values[ i ] ) ) {
                     return true;
                 }
             } else {
                 if( country.props[ columnFilter.columnName ].uiValue === columnFilter.values[ i ] ) {
                     return true;
                 }
             }
         }
         return false;
     } );
 };
 
 /**
  * This function mocks the server logic for filtering date data with the 'Equals' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 const processEqualsDateFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         for( var i = 0; i < columnFilter.values.length; i++ ) {
             var filterDateValue = new Date( columnFilter.values[ i ] );
             var countryDateValue = new Date( country.props[ columnFilter.columnName ].uiValue );
             if( filterDateValue.getTime() === countryDateValue.getTime() ) {
                 return true;
             }
         }
         return false;
     } );
 };
 
 /**
  * This function mocks the server logic for filtering text data with the 'Equals' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 const processEqualsTextFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         for( var i = 0; i < columnFilter.values.length; i++ ) {
             if( !country.props[ columnFilter.columnName ].isArray ) {
                 if( country.props[ columnFilter.columnName ].value && columnFilter.values[ i ] ) {
                     return country.props[ columnFilter.columnName ].value.toString().toLowerCase().includes( columnFilter.values[ i ].toLowerCase() );
                 } else if( columnFilter.values[ i ] === '' && ( !country.props[ columnFilter.columnName ].value || country.props[ columnFilter.columnName ].value === null ) ) {
                     return true;
                 }
             } else {
                 if( country.props[ columnFilter.columnName ].uiValues && columnFilter.values[ i ] ) {
                     return country.props[ columnFilter.columnName ].uiValues.toString().toLowerCase().includes( columnFilter.values[ i ].toLowerCase() );
                 }
             }
         }
         return false;
     } );
 };
 
 /**
  * This function mocks the server logic for filtering text data with the 'Equals' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 const processCaseSensitiveEqualsTextFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         for( var i = 0; i < columnFilter.values.length; i++ ) {
             if( !country.props[ columnFilter.columnName ].isArray ) {
                 if( country.props[ columnFilter.columnName ].value && columnFilter.values[ i ] ) {
                     return country.props[ columnFilter.columnName ].value.toString().includes( columnFilter.values[ i ] );
                 } else if( columnFilter.values[ i ] === '' && ( !country.props[ columnFilter.columnName ].value || country.props[ columnFilter.columnName ].value === null ) ) {
                     return true;
                 }
             } else {
                 if( country.props[ columnFilter.columnName ].uiValues && columnFilter.values[ i ] ) {
                     return country.props[ columnFilter.columnName ].uiValues.toString().includes( columnFilter.values[ i ] );
                 }
             }
         }
         return false;
     } );
 };
 
 /**
  * This function mocks the server logic for filtering numeric data with the 'Does not equal' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 const processNotEqualsNumericFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         for( var i = 0; i < columnFilter.values.length; i++ ) {
             if( country.props[ columnFilter.columnName ].value === null && columnFilter.values[ i ] === '' ) {
                 return false;
             }
             if( country.props[ columnFilter.columnName ].uiValue !== '0' ) {
                 if( country.props[ columnFilter.columnName ].uiValue === columnFilter.values[ i ] || country.props[ columnFilter.columnName ].value === Number( columnFilter.values[ i ] ) ) {
                     return false;
                 }
             } else {
                 if( country.props[ columnFilter.columnName ].uiValue === columnFilter.values[ i ] ) {
                     return false;
                 }
             }
         }
         return true;
     } );
 };
 
 /**
  * Mocks server logic for filtering date facets with 'notEquals' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 const processNotEqualsDateFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         for( var i = 0; i < columnFilter.values.length; i++ ) {
             var filterDateValue = new Date( columnFilter.values[ i ] );
             var countryDateValue = new Date( country.props[ columnFilter.columnName ].uiValue );
             if( countryDateValue.getTime() === filterDateValue.getTime() ) {
                 return false;
             }
         }
         return true;
     } );
 };
 
 /**
  * Mocks server logic for filtering Text data with 'Does not equal' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 const processNotEqualsTextFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         for( var i = 0; i < columnFilter.values.length; i++ ) {
             if( !country.props[ columnFilter.columnName ].isArray ) {
                 if( columnFilter.values[ i ] === '' && ( !country.props[ columnFilter.columnName ].value || country.props[ columnFilter.columnName ].value === null ) ) {
                     return false;
                 } else if( country.props[ columnFilter.columnName ].uiValue && columnFilter.values[ i ] ) {
                     return !country.props[ columnFilter.columnName ].uiValue.toLowerCase().includes( columnFilter.values[ i ].toLowerCase() );
                 }
             } else {
                 if( country.props[ columnFilter.columnName ].uiValues && columnFilter.values[ i ] ) {
                     _.forEach( country.props[ columnFilter.columnName ].uiValues, function( uiValue ) {
                         //If one or more values in the array do not satisfy filter criteria, notEquals filter does not apply and the row is shown
                         if( uiValue.toLowerCase() !== columnFilter.values[ i ].toLowerCase() ) {
                             return true;
                         }
                     } );
                     return false;
                 }
             }
         }
         return true;
     } );
 };
 
 /**
  * Mocks server logic for filtering Text facets with 'caseSensitiveNotEquals' operation.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 const processCaseSensitiveNotEqualsFilter = function( columnFilter, countries ) {
     return countries.filter( function( country ) {
         for( var i = 0; i < columnFilter.values.length; i++ ) {
             if( !country.props[ columnFilter.columnName ].isArray ) {
                 if( columnFilter.values[ i ] === '' && ( !country.props[ columnFilter.columnName ].value || country.props[ columnFilter.columnName ].value === null ) ) {
                     return false;
                 } else if( country.props[ columnFilter.columnName ].uiValue && columnFilter.values[ i ] ) {
                     return !country.props[ columnFilter.columnName ].uiValue.includes( columnFilter.values[ i ] );
                 }
             } else {
                 if( country.props[ columnFilter.columnName ].uiValues && columnFilter.values[ i ] ) {
                     let matchFound = false;
                     _.forEach( country.props[ columnFilter.columnName ].uiValues, function( uiValue ) {
                         if( uiValue !== columnFilter.values[ i ] ) {
                             matchFound = true;
                         }
                     } );
                     return matchFound;
                 }
             }
         }
         return true;
     } );
 };
 
 const processNumericFilters = function( columnFilter, countries ) {
     switch ( columnFilter.operation ) {
         case 'range':
             countries = processNumericRangeFilter( columnFilter, countries );
             break;
         case 'gt':
             countries = processGreaterThanFilter( columnFilter, countries );
             break;
         case 'lt':
             countries = processLessThanFilter( columnFilter, countries );
             break;
         case 'gte':
             countries = processGreaterThanEqualsNumericFilter( columnFilter, countries );
             break;
         case 'lte':
             countries = processLessThanEqualsNumericFilter( columnFilter, countries );
             break;
         case 'equals':
         case 'caseSensitiveEquals':
             countries = processEqualsNumericFilter( columnFilter, countries );
             break;
         case 'notEquals':
         case 'caseSensitiveNotEquals':
             countries = processNotEqualsNumericFilter( columnFilter, countries );
             break;
         default:
             break;
     }
     return countries;
 };
 
 const processDateFilters = function( columnFilter, countries ) {
     switch ( columnFilter.operation ) {
         case 'range':
             countries = processDateRangeFilter( columnFilter, countries );
             break;
         case 'gte':
             countries = processGreaterThanEqualsDateFilter( columnFilter, countries );
             break;
         case 'lte':
             countries = processLessThanEqualsDateFilter( columnFilter, countries );
             break;
         case 'equals':
         case 'caseSensitiveEquals':
             countries = processEqualsDateFilter( columnFilter, countries );
             break;
         case 'notEquals':
         case 'caseSensitiveNotEquals':
             countries = processNotEqualsDateFilter( columnFilter, countries );
             break;
         default:
             break;
     }
     return countries;
 };
 
 const processTextFilters = function( columnFilter, countries ) {
     switch ( columnFilter.operation ) {
         case 'contains':
             countries = processContainsFilter( columnFilter, countries );
             break;
         case 'notContains':
             countries = processNotContainsFilter( columnFilter, countries );
             break;
         case 'startsWith':
             countries = processStartsWithFilter( columnFilter, countries );
             break;
         case 'endsWith':
             countries = processEndsWithFilter( columnFilter, countries );
             break;
         case 'equals':
             countries = processEqualsTextFilter( columnFilter, countries );
             break;
         case 'caseSensitiveEquals':
             countries = processCaseSensitiveEqualsTextFilter( columnFilter, countries );
             break;
         case 'notEquals':
             countries = processNotEqualsTextFilter( columnFilter, countries );
             break;
         case 'caseSensitiveNotEquals':
             countries = processCaseSensitiveNotEqualsFilter( columnFilter, countries );
             break;
         default:
             break;
     }
     return countries;
 };
 
 /**
  * This function mocks the server logic for filtering data using the created filters from client.
  * This is called from the main function that gets the filter facets. Since this function is mocking server logic,
  * it should not be implemented on client.
  *
  * @param {Object} columnFilter Filter to apply
  * @param {Array} countries The dataset to filter
  * @returns {Object} The country data that matches the filter
  */
 const createFilters = function( columnFilter, countries ) {
     switch( countries[0].props[ columnFilter.columnName ].type ) {
         case 'INTEGER':
         case 'DOUBLE':
         case 'FLOAT':
             countries = processNumericFilters( columnFilter, countries );
             break;
         case 'DATE':
             countries = processDateFilters( columnFilter, countries );
             break;
         case 'STRING':
             countries = processTextFilters( columnFilter, countries );
             break;
         default:
             break;
     }
     return countries;
 };
 
 export default {
     applySortAndFilterRows,
     getFilterFacets,
     getFilterFacetData
 };
 