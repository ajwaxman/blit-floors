import { TerraformInfo, fetchTerraforms } from './api/terraforms'
import { format as ts } from 'timeago.js'
import terraformsMetadata from '../data/terraforms.json'

export async function getStaticProps() {
    const data = await fetchTerraforms()
    return {
        props: {
            terraforms: data.terraforms,
            lastUpdate: data.lastUpdate
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

const Home = ({ terraforms, lastUpdate }: Props) => {
    return (
        <div>Hello</div>
    )
}

export default Home