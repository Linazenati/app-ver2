import imgCarousel1 from "../../assets/fo/img/carousel-1.jpg"
import imgCarousel2 from "../../assets/fo/img/carousel-2.jpg"
import CarousselItem from "./CarousselItem"

const Caroussel = () => {
  return (
    <div className="container-fluid p-0">
        <div id="header-carousel" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
                <CarousselItem img={imgCarousel1} title="Tours &amp; Travel in Bejaia" content="Let's Discover The World Together" next={true}/>
                <CarousselItem img={imgCarousel2} title="Traver &amp; Tours" content="Discover Amazing Places With Us" next={false}/>
            </div>

            <a className="carousel-control-prev" href="#header-carousel" data-slide="prev">
                <div className="btn btn-dark" style={{"width":"54px", "height": "45px"}}>
                    <span className="carousel-control-prev-icon mb-n2"></span>
                </div>
            </a>
            
            <a className="carousel-control-next" href="#header-carousel" data-slide="next">
                <div className="btn btn-dark" style={{"width":"54px", "height": "45px"}}>
                    <span className="carousel-control-next-icon mb-n2"></span>
                </div>
            </a>
        </div>
    </div>
  )
}

export default Caroussel