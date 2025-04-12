import React, { useEffect, useState } from 'react';
import './logs.css';

export default function Logs() {
    const [logs, setLogs] = useState([]);
    const [expandedLog, setExpandedLog] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_FETCH_LOGS);
                const logs = await response.json();
                setLogs(logs);
            } catch (err) {
                console.error("Error while fetching logs:", err);
            }
        };

        fetchLogs();
    }, []);

    const toggleExpand = (index) => {
        setExpandedLog(expandedLog === index ? null : index);
    };

    const convertToPastTense = (phrase) => {
        const words = phrase.split(" ");
        if (words.length === 0) return phrase;
        
        let verb = words[0];

        if (verb.endsWith("e")) {
            verb += "d";
        } else if (verb.endsWith("y")) {
            verb = verb.slice(0, -1) + "ied";
        } else {
            verb += "ed";
        }

        return [verb, ...words.slice(1)].join(" ");
    };

    const updateDesc = (desc) => {
        const words = desc.split(" ");
        let verbs = words[2];
        const chuj = `${words[0]} ${words[1]}`;
        return [verbs, chuj];
    };

    return (
        <div className='logs'>
            <ul>
                {logs.map((log, index) => {
                    const pastTenseOperation = convertToPastTense(log.operationName);
                    const updData = updateDesc(log.desc);
                    
                    return (
                        <li key={index} onClick={() => toggleExpand(index)} className={`log-item ${expandedLog === index ? "expanded" : ""}`}>
                            <span>{log.by} </span>{log.operationName}

                            {expandedLog === index && (
                                <div className="log-details">
                                    <p>User <span>{log.by}</span> {pastTenseOperation} <span>{updData[1]}</span></p>
                                    {updData[0] === undefined ? "" : <p>Update: <span>{updData[0]}</span></p>}
                                    <p>Date: <span>{log.date}</span></p>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
