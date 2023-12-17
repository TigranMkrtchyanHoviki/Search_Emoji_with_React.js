import { useEffect, useRef, useState } from "react"
import AppContainerStyles from "./style.module.css"

const emoji = {
    character
        :
        "😀",
    codePoint
        :
        "1F600",
    group
        :
        "smileys-emotion",
    slug
        :
        "e1-0-grinning-face",
    subGroup
        :
        "face-smiling",
    unicodeName
        :
        "E1.0 grinning face",
}


const AppContainer = () => {

    const [search, setSearch] = useState("")
    const [allEmoji, setAllEmoji] = useState(null)
    const [saveAllEmoji, setSaveAllEmoji] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isExist, setIsExist] = useState(false)

    const idRef = useRef()

    const getAllEmoji = async () => {
        const url = "https://emoji-api.com/emojis?access_key=6e9ca6da6f796966d8e1370d1f4b30ca8e0a3e58"
        const options = {
            headers: { 'X-Api-Key': '6e9ca6da6f796966d8e1370d1f4b30ca8e0a3e58' },
            contentType: 'application/json',
            success: function (result) {
                console.log(result);
            },
        }

        fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP response ! status:" + " " + response.status)
                }

                return response.json()
            })
            .then(response => {
                setIsLoading(true)
                setAllEmoji(prev => response)
                setSaveAllEmoji(prev => response)
                return response
            })
            .catch(error => console.error("Fetch failed", error))
    }

    useEffect(() => {
        getAllEmoji()
    }, [])

    useEffect(() => {
        setIsLoading(false)
        if (search) {

            idRef.current = setTimeout(() => {
                setAllEmoji([...allEmoji.filter(emoji => {

                    return emoji.subGroup.includes(search.toLowerCase())

                })])

                setSearch("")
                setTimeout(() => {
                    setIsLoading(true)
                })

            }, 1000)

        }

        return () => {
            clearInterval(idRef.current)
        }

    }, [search])

    useEffect(() => {
        console.log(allEmoji)
        if(Array.isArray(allEmoji) && allEmoji.length === 0) {
            setIsExist(true)
        }

    }, [allEmoji])

    const handlerResetAllEmojis = () => {
        setIsLoading(false)
        setTimeout(() => {
            setIsExist(false)
            setIsLoading(true)
            setAllEmoji(saveAllEmoji)
        }, 1000)

    }

    return (
        <div className={`${AppContainerStyles.container}`}>
            <h3 className={`${AppContainerStyles.title}`}>Choose your emoji</h3>
            <div className={`${AppContainerStyles.input_container}`}>
                <input
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    placeholder="search"
                    type="text" />
            </div>

            <div className={`${AppContainerStyles.reset_container}`}>

                <button onClick={handlerResetAllEmojis}>Reset all emojis</button>

            </div>

            <div className={`${AppContainerStyles.emojis_container}`}>

                <div className={`${AppContainerStyles.emojis_inner_container}`}>
                    {
                        isLoading
                            ?
                            (
                                isExist
                                    ?
                                    <p className={`${AppContainerStyles.error}`}>There is no such emoji</p>
                                    :
                                    allEmoji.map(emoji => {
                                        return (
                                            <span key={emoji.codePoint}>{emoji.character}</span>
                                        )
                                    })
                            )
                            :
                            <h1>Loading...</h1>

                    }
                </div>

            </div>
        </div>
    )
}

export default AppContainer