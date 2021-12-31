import { NextApiRequest, NextApiResponse } from 'next'
import pMap from 'p-map'
import { chunk, flatten, orderBy } from 'lodash'
import { utils as etherUtils, BigNumber } from 'ethers'
import originXSeeds from '../../data/origin-x-seeds.json'
import terraformMetadata from '../../data/terraforms.json'


const options = { method: 'GET' };

const fetchTerraformPage = async (ids: string[]) => {
    let url = 'https://api.opensea.io/api/v1/assets?collection=terraforms&'
    url += ids.map((id) => `token_ids=${id}`).join('&')

    const res = await fetch(url, options);
    const json = await res.json()
    return json.assets
}

export interface TerraformInfo {
    id: string
    price: Number
    seed: Number
    url: string
    svg: string
}

const chunked = chunk(originXSeeds, 20)

export const fetchOriginXSeeds = async () => {
    const data = await pMap(chunked, fetchTerraformPage, { concurrency: 2 })
    const mapped = flatten(data)
        .filter((d) => {
            return d.sell_orders && d.sell_orders.length > 0 && d.sell_orders[0].payment_token_contract.symbol == 'ETH'
        })
        .map((a): TerraformInfo => {
            return {
                id: a.token_id,
                price: Number(
                    etherUtils.formatUnits(
                        BigNumber.from(a.sell_orders[0].current_price.split('.')[0]),
                    ),
                ),
                seed: terraformMetadata[a.token_id -1]["seedValue"],
                url: a.permalink,
                svg: a.image_url,
            }
        })
    return {
        terraforms: orderBy(mapped, ['price', 'id'], ['asc', 'asc']),
        lastUpdate: new Date().toISOString(),
        outOf: originXSeeds.length
    }
}

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const data = await fetchOriginXSeeds()
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message })
    }
}

export default handler
