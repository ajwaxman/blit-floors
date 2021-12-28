import { TerraformInfo, fetchTerraforms } from './api/terraforms'
import { format as ts } from 'timeago.js'
import terraformsMetadata from '../data/terraforms.json'
import longLoops from '../data/long-loops.json'

export async function getStaticProps() {
    const data = await fetchTerraforms()
    return {
        props: {
            terraforms: data.terraforms,
            lastUpdate: data.lastUpdate,
        },
        revalidate: 300,
    }
}

interface Props {
    terraforms: TerraformsInfo[]
    lastUpdate: string
}

const TerraformNew = ({ terraform }: { terraform: TerraformInfo }) => {
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

const Terraform = ({ terraform }: { terraform: TerraformInfo }) => {
    return (
        <a href={terraform.url} target="_blank">
            <div className="m-auto pb-4 mb-8 flex flex-col justify-center items-center gap-2 p-4 md:m-4 border border-white transform hover:scale-105 transition-all bg-black w-full md:w-96">
                <img src={terraform.svg} />
                <div className="text-center">
                    <p className="text-lg">#{terraform.id} - {terraform.seed}</p>
                    <p>{terraform.price} ETH</p>
                </div>
            </div>
        </a>
    )
}

const About = ({ terraforms, lastUpdate }: Props) => {
    console.log(terraformsMetadata[0]["level"]);
    return (
        <div className="py-3 md:pb-0 font-mono tracking-tighter flex flex-col justify-center items-center gap-4 pt-10 md:w-screen">
            <h1 className="text-lg text-[#68d000] md:text-2xl font-bold"><span className="pr-1.5">🌱</span> Seed Sniper</h1>
            <div className="text-gray-100 text-center max-w-screen-md md:leading-loose">
                <p className="md:text-lg mt-1">
                    There are {terraforms.length} out of {longLoops.length} <a href="https://docs.google.com/presentation/d/1v0ccwju6isFD8lIRKFyiPLxbVJhPCSmLLjxF3TBZG4I/edit#slide=id.g109bfa92b01_22_0" target="_blank" className="underline hover:text-sky-400 duration-200 transition-all"> long loopers</a> for sale.
                </p>
                <p className="text-gray-100 text-sm mv-4 mt-3">Last updated {ts(lastUpdate)}</p>
                <p className="text-sm text-gray-400 mt-5 border-t mt-8 pt-8 border-gray-100">
                    Site by {' '}
                    <a
                        target="_blank"
                        href="https://twitter.com/ajwaxman"
                        className="underline text-sky-300 hover:text-sky-400 duration-200 transition-all"
                    >
                        @ajwaxman
                    </a>
                    . Built on top of {' '}
                    <a
                        target="_blank"
                        href="https://twitter.com/worm_emoji"
                        className="underline text-sky-300 hover:text-sky-400 duration-200 transition-all"
                    >
                        @worm_emoji
                    </a> 
                    {' '} and {' '}
                    <a
                        target="_blank"
                        href="https://twitter.com/uronsol"
                        className="underline text-sky-300 hover:text-sky-400 duration-200 transition-all"
                    >
                        @uronsol
                    </a>'s work.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                Tips appreciated: 0xE332de3c84C305698675A73F366061941C78e3b4
                </p>
            </div>
            <div className="grid md:grid-cols-2 pt-2 text-white">
                {terraforms.map((terraform) => {
                    // return <Terraform terraform={terraform} key={terraform.id} />
                     return <TerraformNew terraform={terraform} key={terraform.id} />
                })}
            </div>
        </div>
    )
}

export default About