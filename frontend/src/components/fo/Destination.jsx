import DestinationItem from "./DestinationItem"

import imgDest1 from "../../assets/fo/img/destination-1.jpg"
import imgDest2 from "../../assets/fo/img/destination-2.jpg"
import imgDest3 from "../../assets/fo/img/destination-3.jpg"
import imgDest4 from "../../assets/fo/img/destination-4.jpg"
import imgDest5 from "../../assets/fo/img/destination-5.jpg"
import imgDest6 from "../../assets/fo/img/destination-6.jpg"

function Destination() {
  return (
    <div className="container-fluid py-5">
        <div className="container pt-5 pb-3">
            <div className="text-center mb-3 pb-3">
                <h6 className="text-primary text-uppercase" style={{"letterSpacing": "5px"}}>Destination</h6>
                <h1>Explore Top Destination</h1>
            </div>
            <div className="row">
                <DestinationItem img={imgDest1} country="United States" info="100 Cities" toLink="/web/about"/>
                <DestinationItem img={imgDest2} country="United Kingdom" info="100 Cities" toLink="/web/home"/>
                {/* 
                
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="destination-item position-relative overflow-hidden mb-2">
                        <img className="img-fluid" src={imgDest3} alt=""/>
                        <a className="destination-overlay text-white text-decoration-none" href="">
                            <h5 className="text-white">Australia</h5>
                            <span>100 Cities</span>
                        </a>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="destination-item position-relative overflow-hidden mb-2">
                        <img className="img-fluid" src={imgDest4} alt=""/>
                        <a className="destination-overlay text-white text-decoration-none" href="">
                            <h5 className="text-white">India</h5>
                            <span>100 Cities</span>
                        </a>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="destination-item position-relative overflow-hidden mb-2">
                        <img className="img-fluid" src={imgDest5} alt=""/>
                        <a className="destination-overlay text-white text-decoration-none" href="">
                            <h5 className="text-white">South Africa</h5>
                            <span>100 Cities</span>
                        </a>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                    <div className="destination-item position-relative overflow-hidden mb-2">
                        <img className="img-fluid" src={imgDest6} alt=""/>
                        <a className="destination-overlay text-white text-decoration-none" href="">
                            <h5 className="text-white">Indonesia</h5>
                            <span>100 Cities</span>
                        </a>
                    </div>
                </div>
                 */}
            </div>
        </div>
    </div>
  )
}

export default Destination