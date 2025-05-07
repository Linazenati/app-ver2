import React from 'react'

const CarousselItem = (props) => {
    const {img, title, content, next} = props;

  return (
    <div className={`carousel-item ${next ? 'carousel-item-next' : 'active'}  carousel-item-left`}>
        <img className="w-100" src={img} alt="Image" />
        <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
            <div className="p-3" style={{"maxWidth":"900px"}}>
                <h4 className="text-white text-uppercase mb-md-3">{title}</h4>
                <h1 className="display-3 text-white mb-md-4">{content}</h1>
                <a href="" className="btn btn-primary py-md-3 px-md-5 mt-2">Book Now</a>
            </div>
        </div>
    </div>
  )
}

export default CarousselItem