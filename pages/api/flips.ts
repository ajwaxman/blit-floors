import { NextApiRequest, NextApiResponse } from 'next'
import pMap from 'p-map'
import { chunk, flatten, orderBy } from 'lodash'
import { utils as etherUtils, BigNumber } from 'ethers'
import compositionData from '../../data/compositions.json'
import compositionTestData from '../../data/compositions-test.json'

const exampleFlipmapUrl = "https://indexer-v31-mainnet.up.railway.app//tokens?collection=flipmap&sortBy=floorSellValue&sortDirection=asc&offset=0&limit=5&attributes%5BComposition%5D=Dunce%20(%2368)"
const exampleTerraformUrl = "https://indexer-v31-mainnet.up.railway.app//tokens?collection=terraforms&sortBy=floorSellValue&sortDirection=asc&offset=0&limit=6&attributes%5BLevel%5D=5"



const fetchCompositions = async (offset) => {
    let url = "https://indexer-v3-api-production.up.railway.app/collections/blitmap/attributes?attribute=Composition&limit=20&offset="
    url += offset;
    
    var _ = require('lodash');

    const res = await fetch(url);
    const json = await res.json()
    const attributes = json["attributes"]

    let attributesArray = [];
    
    _.forEach(attributes, function(a) {
        // console.log(a["value"]);
        attributesArray.push(a["value"]);
    });
    return attributesArray
}

const fetchFlipFloor = async (name) => {
    let url = "https://indexer-v31-mainnet.up.railway.app/tokens?collection=blitmap&sortBy=floorSellValue&sortDirection=asc&offset=0&limit=6&attributes%5BComposition%5D="
    url += encodeURIComponent(name);

    const res = await fetch(url)
    const json = await res.json()
    return json["tokens"]
}

const getFloor = (apiData, index, depth) => {
    try {
        if (apiData[index][depth]["floorSellValue"] == null) {
            return 100000
        } else {
            return Math.round(apiData[index][depth]["floorSellValue"] * 100) / 100
        }
    }
    catch (e) {
        return 100000
        console.log(apiData)
    }
}

export interface FlipInfo {
    name: string
    item_number: String
    floor: Number
    one_away: Number
    three_away: Number
    five_away: Number
    url: string 
    bid_url: string
}

export const fetchFlips = async () => {

    var _ = require('lodash');

    let compositions = compositionData;

    const apiData = await pMap(compositions, fetchFlipFloor, { concurrency: 1 })

    const mapped = compositionData
        .map((c, index): FlipInfo => {
            return {
                name: c,
                item_number: c.split("#").pop().split(')')[0],
                floor: getFloor(apiData, index, 0),
                one_away: getFloor(apiData, index, 1),
                three_away: getFloor(apiData, index, 3),
                five_away: getFloor(apiData, index, 5),
                url:"https://opensea.io/assets/blitmap?search[sortAscending]=true&search[sortBy]=PRICE&search[stringTraits][0][name]=Composition&search[stringTraits][0][values][0]="+escape(c)+"&search[toggles][0]=BUY_NOW",
                bid_url: "https://opensea.io/assets/blitmap?search[sortAscending]=true&search[sortBy]=PRICE&search[stringTraits][0][name]=Palette&search[stringTraits][0][values][0]=" + escape(c),
            }
        })
    return {
        flips: orderBy(mapped, ['floor'], ['desc']),
        compositions: compositions,
        lastUpdate: new Date().toISOString()
    }
}



export interface LevelInfo {
    level: Number
    quantity: Number
    floor: Number
    url: string
    rarity: string
    css: string
}


const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const data = await fetchFlips()
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
