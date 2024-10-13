import React, { useState, useEffect, useContext } from "react"; // Ensure useContext is imported
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import LayoutOne from "../../layouts/LayoutOne";
// import { CartContext } from "../CartContext";
import "./Productdetails.css"; // Import the custom CSS

const ProductDetails = () => {
  const { productId } = useParams();
  // const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/product/${productId}`)
      .then((response) => setProduct(response.data))
      .catch((error) => {
        console.error(
          "There was an error fetching the product details!",
          error
        );
      });

    // Create WebSocket connection
    const client = new W3CWebSocket("ws://localhost:3001");

    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    // Handle messages received from the server
    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.product) {
        setProduct(data.product);
      }
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      client.close();
    };
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  return (
    <LayoutOne headerTop="visible">
      <Container className="product-details-container">
        <Row>
          <Col md={6} className="product-image">
            {product.image && (
              <img
                src={`http://localhost:3001${product.image}`}
                alt={product.name}
                className="img-fluid"
              />
            )}
          </Col>
          <Col md={6} className="product-info">
            <h1>{product.name}</h1>
            <p>Price: {product.price} Tk</p>
            <p>{product.details}</p>
            <Button variant="primary" onClick={() => addToCart(product)}>
              Add to Cart
            </Button>
          </Col>
        </Row>
      </Container>
    </LayoutOne>
  );
};

export default ProductDetails;
