import { TerraformInfo, fetchUnder100 } from './api/under-100'
import { format as ts } from 'timeago.js'
import terraformsMetadata from '../data/terraforms.json'

export async function getStaticProps() {
    const data = await fetchUnder100()
    return {
        props: {
            terraforms: data.terraforms,
            lastUpdate: data.lastUpdate,
            outOf: data.outOf
        },
        revalidate: 300,
    }
}

interface Props {
    terraforms: TerraformInfo[]
    lastUpdate: string
}

const Terraform = ({ terraform }: { terraform: TerraformInfo }) => {
    return (
        <a href={terraform.url} target="_blank">
            <div className="m-auto text-white pb-4 mb-8 flex flex-col justify-center items-center gap-2 p-4 md:m-4 transform hover:scale-105 active:scale-100 duration-300 transition-all w-full md:w-96">
                <img className="" src={terraform.svg} />
                <div className="text-center">
                    <p className="text-lg">#{terraform.id}</p>
                    <p className="text-gray-300">{terraform.price} ETH <span className="px-2">·</span> <span className="pr-0">Seed:</span> {terraform.seed}</p>
                </div>
            </div>
        </a>
    )
}

const Under100 = ({ terraforms, lastUpdate, outOf }: Props) => {
    return (
        <div className="py-3 md:pb-0 font-mono tracking-tighter flex flex-col justify-center items-center gap-4 pt-10 md:w-screen">
            <h1 className="text-lg text-[#68d000] md:text-2xl font-bold"><span className="pr-1.5">🌱</span> SEED {"<"} 100</h1>
            <div className="text-gray-100 text-center max-w-screen-md md:leading-loose">
                <p className="md:text-lg mt-1">
                    There are {terraforms.length} out of {outOf} items with SEED {'<'} 100 for sale.
                </p>
                <p className="text-gray-100 text-sm mv-4 mt-3">Last updated {ts(lastUpdate)}</p>
            </div>
            <div className="grid md:grid-cols-2 pt-2 text-white">
                {terraforms.map((terraform) => {
                    // return <Terraform terraform={terraform} key={terraform.id} />
                     return <Terraform terraform={terraform} key={terraform.id} />
                })}
            </div>
        </div>
    )
}

export default Under100