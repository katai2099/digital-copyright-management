export interface BackdropProp {
    onClick : () => void
}

export const Backdrop = (props : BackdropProp)=>{
    return (<div className="backdrop" onClick={()=>{props.onClick()}}>
        </div>)
}