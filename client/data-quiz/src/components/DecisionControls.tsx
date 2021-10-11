import React from "react";
import { Country } from "../model";

export interface ControlsProps {
    countries: Country[]
}

export const DecisionControls: React.FC<ControlsProps> = (props: ControlsProps) => {
    return (
        <div>
            {
                props.countries.map(country =>
                    <button>
                        {country.name}
                    </button>
                )
            }
        </div>
    )

    // return <>controls</>
}