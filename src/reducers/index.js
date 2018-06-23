
import extractor from 'css-color-extractor'
import parse from 'parse-color'
import DeltaE from 'delta-e'
import rgb2lab from '../libs/rgb2lab'
import removeDuplicates from '../libs/removeDuplicatesFromArrayByKey'

const initialState = {}

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

    return {
        exampleData,
        extractedColours: expanded,
        deduplicated,
        groupedPalette,
    }
}

const reducer = (state, action) => {
    if (action.type === `PARSE`) {
        return {
            ...state,
            ...parseData(action.payload)
        }
    }
    return state
}

export default reducer