import React, { useState, useRef, useEffect } from 'react';
import { Heart, MapPin, Home, Search, BookMarked, User } from 'lucide-react';
import './styles/main.css';

const PROPERTIES = [
  {
    id: '1',
    title: 'Sushant Lok 2, Gurgaon',
    price: '1.5 Cr',
    location: 'H. Gurgaon, Behram Rd, Yerwada, Kota',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    ],
    liked: false,
  },
  {
    id: '2',
    title: 'Rainbow Heights, HSR',
    price: '2.1 Cr',
    location: 'HSR Layout, Bangalore',
    images: [
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=800',
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800',
    ],
    liked: false,
  },
  {
    id: '3',
    title: 'Palm Grove Residency',
    price: '3.2 Cr',
    location: 'Whitefield, Bangalore',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    ],
    liked: false,
  },
  {
    id: '4',
    title: 'Emerald Bay Apartments',
    price: '1.8 Cr',
    location: 'Electronic City, Bangalore',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800',
    ],
    liked: false,
  },
  {
    id: '5',
    title: 'Marina Heights',
    price: '4.5 Cr',
    location: 'Marine Drive, Mumbai',
    images: [
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    ],
    liked: false,
  },
  {
    id: '6',
    title: 'Green Valley Villas',
    price: '2.8 Cr',
    location: 'Koramangala, Bangalore',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800',
    ],
    liked: false,
  }
];

function App() {
  const [properties, setProperties] = useState(PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);
  const lastPropertyRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreProperties();
        }
      },
      { threshold: 0.1 }
    );

    if (lastPropertyRef.current) {
      observerRef.current.observe(lastPropertyRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [properties, loading]);

  const loadMoreProperties = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newProperties = [...PROPERTIES].map(prop => ({
      ...prop,
      id: prop.id + Date.now()
    }));
    setProperties(prev => [...prev, ...newProperties]);
    setLoading(false);
  };

  const toggleLike = (propertyId) => {
    setProperties(properties.map(property => 
      property.id === propertyId 
        ? { ...property, liked: !property.liked }
        : property
    ));
  };

  const PropertyCard = ({ property, isLast }) => (
    <div 
      className="property-card"
      ref={isLast ? lastPropertyRef : null}
      onClick={() => setSelectedProperty(property)}
    >
      <div className="property-image-container">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="property-image"
        />
        <button 
          className="wishlist-button"
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(property.id);
          }}
        >
          <Heart 
            size={20} 
            fill={property.liked ? '#FF6B00' : 'none'} 
            color={property.liked ? '#FF6B00' : '#666'}
          />
        </button>
      </div>
      <div className="property-details">
        <h3 className="property-title">{property.title}</h3>
        <p className="property-price">{property.price}</p>
        <p className="property-location">
          <MapPin size={16} />
          {property.location}
        </p>
      </div>
    </div>
  );

  const PropertyDetail = ({ property }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const touchStart = useRef(null);

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e) => {
      if (!touchStart.current) return;
      
      const touch = e.touches[0];
      const deltaX = touchStart.current.x - touch.clientX;
      
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0 && currentImageIndex < property.images.length - 1) {
          setCurrentImageIndex(prev => prev + 1);
        } else if (deltaX < 0 && currentImageIndex > 0) {
          setCurrentImageIndex(prev => prev - 1);
        }
        touchStart.current = null;
      }
    };

    return (
      <div className="property-detail">
        <div 
          className="image-slider"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div 
            className="slider-container"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {property.images.map((image, index) => (
              <img 
                key={index}
                src={image}
                alt={`Property ${index + 1}`}
                className="slider-image"
              />
            ))}
          </div>
        </div>
        <div className="property-details">
          <h2 className="property-title">{property.title}</h2>
          <p className="property-price">{property.price}</p>
          <p className="property-location">
            <MapPin size={16} />
            {property.location}
          </p>
        </div>
        <div className="map-container" id="map">
          
        </div>
        <div className="amenities">
          <span className="amenity-tag">3 BHK</span>
          <span className="amenity-tag">Apartment</span>
          <span className="amenity-tag">Swimming Pool</span>
          <span className="amenity-tag">Gym</span>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <header className="header">
        <span className="logo">propsoch</span>
      </header>

      {selectedProperty ? (
        <PropertyDetail property={selectedProperty} />
      ) : (
        <div className="property-grid">
          {properties.map((property, index) => (
            <PropertyCard 
              key={property.id}
              property={property}
              isLast={index === properties.length - 1}
            />
          ))}
        </div>
      )}

      <nav className="nav-bar">
        <a href="#" className="nav-item active">
          <Home size={24} />
          <span>Explore</span>
        </a>
        <a href="#" className="nav-item">
          <Search size={24} />
          <span>Search</span>
        </a>
        <a href="#" className="nav-item">
          <BookMarked size={24} />
          <span>Saved</span>
        </a>
        <a href="#" className="nav-item">
          <User size={24} />
          <span>Profile</span>
        </a>
      </nav>
    </div>
  );
}

export default App;