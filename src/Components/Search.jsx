import './Search.css'
import {useEffect, useRef, useState} from "react";
import debounce from 'lodash.debounce';

export default function Search({onCreate, isClicked}) {

    const [label, setLabel] = useState('')
    const debouncedSearch = useRef()

    useEffect(() => {
            debouncedSearch.current = debounce((query) => {
                onCreate(query)
                setLabel('')
            }, 500)

            return debouncedSearch.current.cancel()
        }, [onCreate]
    )

    function onLabelChange(e) {
        const value = e.target.value
        setLabel(value)
        debouncedSearch.current(value)
    }

    function onSubmit(e) {
        e.preventDefault()
    }

    return (
        <>
            {!isClicked ? (
                <form onSubmit={onSubmit}>
                    <input
                        className="search"
                        placeholder="Type to search..."
                        type="text"
                        onChange={onLabelChange}
                        value={label}
                        autoFocus
                    />
                </form>
            ) : null}
        </>
    )
}