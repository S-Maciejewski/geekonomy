import React from "react";

export interface ControlsProps {
    countries: string[]
}

export const DecisionControls: React.FC<ControlsProps> = (props: ControlsProps) => {
    return (
        <div>
            {
                props.countries.map(country =>
                    <button>
                        {country}
                    </button>
                )
            }
        </div>
    )

    // return <>controls</>
}