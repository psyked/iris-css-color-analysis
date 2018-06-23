
import extractor from 'css-color-extractor'
import parse from 'parse-color'
import DeltaE from 'delta-e'
// import axios from 'axios'
// import queryString from 'query-string-es5'
import rgb2lab from '../libs/rgb2lab'
import removeDuplicates from '../libs/removeDuplicatesFromArrayByKey'

const initialState = { count: 0 }

const parseData = (exampleData) => {
    // console.log(exampleData)
    // extract color declarations from a full stylesheet
    const extractedColours = extractor.fromCss(exampleData);

    // expand the input colours into their other-format equivalents
    const expanded = extractedColours
        // replace with the full details
        .map(declaration => {
            const r = new RegExp(declaration.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '[\s|;|!|\)]', 'g')
            const matches = exampleData.match(r);
            // console.log('regex?', r)
            // console.log('exampleData', exampleData.match(r).length)
            return {
                ...parse(declaration), // use all of the values from 'parse-color'
                lab: rgb2lab(parse(declaration).rgb), // lab values are needed for Delta-E analysis
                raw: declaration, // so we know how it's been referenced in the source code,
                useCount: matches ? matches.length : 0
            }
        })
        // remove any invalid values that couldn't be parsed into hex values
        .filter(({ hex }) => !!hex)

    const expandedRefs = expanded.map(colorInfo => {
        // console.log(expanded.filter(({ hex }) => hex === colorInfo.hex))
        return {
            ...colorInfo,
            useCount: expanded.filter(({ hex }) => hex === colorInfo.hex).map(({ useCount }) => useCount).reduce((prev, curr) => prev + curr),
            raw: expanded.filter(({ hex }) => hex === colorInfo.hex).map(({ raw }) => raw)
        }
    }).sort((a, b) => {
        return b.useCount - a.useCount
    })

    let newData = exampleData;

    expandedRefs.map(colours => {
        newData = newData.replace(colours.raw, `rgba(${colours.rgba})`)
    })

    const deduplicated = removeDuplicates(expandedRefs, 'hex');

    const groupedPalette = deduplicated.map((color) => {
        return {
            ...color,
            distance: deduplicated.filter(curr => color !== curr).map((curr) => {
                const color1 = { L: color.lab[0], A: color.lab[1], B: color.lab[2] }
                const color2 = { L: curr.lab[0], A: curr.lab[1], B: curr.lab[2] }
                return {
                    hex: curr.hex,
                    distance: DeltaE.getDeltaE00(color1, color2)
                };
            }).sort((a, b) => {
                return a.distance - b.distance
            })
        }
    })

    const groups = groupedPalette.map(({ hex, distance }) => {
        return [
            ...distance.filter(({ distance }) => {
                return distance < 1
            }).map(({ hex: dhex }) => {
                return deduplicated.find(({ hex }) => dhex === hex)
            })
        ]
            .concat(deduplicated.find(({ hex: fhex }) => fhex === hex))
            .sort(({ hex: a }, { hex: b }) => {
                return parseInt(a.replace('#', ''), 16) - parseInt(b.replace('#', ''), 16);
            })
    }).filter(ar => ar.length > 1)

    let remappedGroups = groups.map((group) => {
        return {
            id: group.map(({ hex }) => hex).join('-'),
            value: group
        }
    })

    remappedGroups = removeDuplicates(remappedGroups, 'id')

    const allKeys = remappedGroups.map(({ id }) => id)
    // console.log(allKeys);

    remappedGroups = remappedGroups.filter((group) => {
        const keysWithSubset = allKeys.filter((key) => key.indexOf(group.id) !== -1)
        // console.log(group.id, keysWithSubset);
        return keysWithSubset.length === 1
    })
    // .filter((val, pos, arr) => {
    //   const justIds = arr.map(({ id }) => id).filter((val, index) => index !== pos)
    //   console.log(String(justIds), val.id, String(justIds).indexOf(val.id))
    //   return String(justIds).indexOf(val.id) === -1
    // })
    // remappedGroups = remappedGroups.filter((group) => {
    //   const allIds = remappedGroups.map(({ id }) => id);
    //   return allIds.some(({ hex: val }) => { return group.id.indexOf(val) >= 0; })
    //   // return allIds.filter((curr) => {
    //   //   // console.log(curr, group.id, curr.indexOf(group.id), prev + curr.indexOf(group.id) !== -1)
    //   //   return curr.indexOf(group.id) !== -1;// || prev;//index
    //   // }).length
    // })
    // remappedGroups.every(function(val) { return PlayerTwo.indexOf(val) >= 0; })

    const deduplicatedgroups = remappedGroups
        .sort(({ value: a }, { value: b }) => {
            const ahue = a[0]['hsv'][0]
            const bhue = b[0]['hsv'][0]
            if (ahue !== bhue) {
                return bhue - ahue;
            }
            return b.length - a.length
        })

    // console.log({
    //     exampleData,
    //     newData,
    //     expanded,
    //     extractedColours,
    //     deduplicated,
    //     groupedPalette,
    //     groups,
    //     deduplicatedgroups
    // })

    return {
        exampleData,
        newData,
        expanded,
        extractedColours,
        deduplicated,
        groupedPalette,
        groups,
        deduplicatedgroups
    }
}

const reducer = (state, action) => {
    if (action.type === `PARSE`) {
        //   return Object.assign({}, state, {
        //     count: state.count + 1,
        //   })
        // console.log(action.payload)
        console.log(parseData(action.payload))
        return {
            ...state,
            ...parseData(action.payload)
        }
    }
    return state
}

export default reducer