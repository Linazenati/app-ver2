import { Link } from "react-router-dom";

const DestinationItem = (props) => {
    const {img, country, info, toLink} = props;

  return (
    <div className="col-lg-4 col-md-6 mb-4">
        <div className="destination-item position-relative overflow-hidden mb-2">
            <img className="img-fluid" src={img} alt=""/>
            <Link className="destination-overlay text-white text-decoration-none" to={toLink}>
                <h5 className="text-white">{country}</h5>
                <span>{info}</span>
            </Link>
        </div>
    </div>
  )
}

export default DestinationItem