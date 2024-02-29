import React from "react";
import "./Logbook.css";
import LogbookLogCard from "../../components/logbooklogcard/LogbookLogCard.jsx";

function Logbook() {




    return (
        <>
            <div className="logbook-outer-container outer-container">
                <div className="inner-container">
                        <h3>Logbook</h3>

                        <LogbookLogCard/>
                </div>
            </div>
        </>
    );

}

export default Logbook;
