import { useState, useEffect } from 'react';
import { evaluate as mathEvaluate } from 'mathjs'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faDivide, faMultiply, faPlus, faMinus, faPercentage, faDeleteLeft,
    fa0, fa1, fa2, fa3, fa6, fa5, fa4, fa7, fa8, fa9
} from "@fortawesome/free-solid-svg-icons";

import "./App.css";

const buttons = [
    [
        ["operation", " ", ""],
        ["operation", "C", "clear"],
        ["operation", <FontAwesomeIcon icon={faDivide} />, "/"],
        ["operation", <FontAwesomeIcon icon={faDeleteLeft} />, "backspace"]
    ],
    [
        ["number", <FontAwesomeIcon icon={fa7} />, "7"],
        ["number", <FontAwesomeIcon icon={fa8} />, "8"],
        ["number", <FontAwesomeIcon icon={fa9} />, "9"],
        ["operation", <FontAwesomeIcon icon={faMultiply} />, "*"]
    ],
    [
        ["number", <FontAwesomeIcon icon={fa4} />, "4"],
        ["number", <FontAwesomeIcon icon={fa5} />, "5"],
        ["number", <FontAwesomeIcon icon={fa6} />, "6"],
        ["operation", <FontAwesomeIcon icon={faMinus} />, "-"]
    ],
    [
        ["number", <FontAwesomeIcon icon={fa1} />, "1"],
        ["number", <FontAwesomeIcon icon={fa2} />, "2"],
        ["number", <FontAwesomeIcon icon={fa3} />, "3"],
        ["operation", <FontAwesomeIcon icon={faPlus} />, "+"]
    ],
    [
        ["operation", <FontAwesomeIcon icon={faPercentage} />, "%"],
        ["number", <FontAwesomeIcon icon={fa0} />, "0"],
        ["number", ".", "."],
        ["operation", " ", ""]
    ],
]
const symbols = ["+", "-", "*", "/", "%"]

export default () => {
    const equationMaxLength = "000000000000000000000000000000000".length
    const resultMaxLength = "00000000000000000".length

    const [equation, setEquation] = useState("")
    const [displayEquation, setDisplayEquation] = useState("")
    const [result, setResult] = useState("0")

    useEffect(() => {
        setDisplayEquation((_) => equation.split("").map((x) => x === "*" ? "x" : x).join(""))
        try {
            setResult(mathEvaluate(equation).toString())
        } catch (error) {
            setResult((oldResult) => oldResult)
        }
    }, [equation])

    const handelButton = (operation: string) => {
        switch (operation) {
            case "backspace": {
                setEquation((oldEquation => oldEquation.slice(0, -1)))
                break;
            }

            case "clear": {
                setEquation("")
                setResult("0")
                break;
            }

            default: {
                setEquation((oldEquation => {
                    const split = oldEquation.split(/([+\-*/])/)

                    if (["+", "*", "/", "%"].includes(operation) && oldEquation === "") return oldEquation
                    else if (symbols.includes(operation) && symbols.includes(oldEquation[0])) return oldEquation
                    else if (symbols.includes(operation) && symbols.includes(oldEquation[oldEquation.length - 1])) return oldEquation
                    else if (symbols.includes(operation) && oldEquation[oldEquation.length - 1] === operation) return oldEquation
                    else if (symbols.includes(operation) && split[split.length - 1].length > 0 && split[split.length - 1].includes(operation)) return oldEquation
                    else return oldEquation + operation
                }))

                break;
            }
        }
    }

    return (
        <div className="calculator">
            <div className="display">
                {equation.length > 0 && (
                    <div className="display-equation">{displayEquation.slice(0, equationMaxLength)}</div>
                )}
                <div className="display-result">{result.slice(0, resultMaxLength)}</div>
            </div>
            <div className="buttons">
                {buttons.map((row, rowIndex) =>
                    <div key={rowIndex} className="row">
                        {row.map(([type, content, operation], index) =>
                            <button
                                key={`${rowIndex}-${index}`}
                                onClick={() => handelButton(operation.toString())}
                                className={`input ${type}`}
                            >
                                {content}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}