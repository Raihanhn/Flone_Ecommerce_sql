import React, {
  Fragment,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { Card, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaCartPlus, FaEye, FaHeart } from "react-icons/fa";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import "./ProductGrid.css"; // Import the custom CSS
import { CartContext } from "../../cartcontext/CartContext";

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    // Fetch initial product data from the server
    axios
      .get("http://localhost:3001/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));

    // Create WebSocket connection
    const client = new W3CWebSocket("ws://localhost:3001");

    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    // Handle messages received from the server
    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.products) {
        setProducts(data.products);
      }
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      client.close();
    };
  }, [categoryId]);

  return (
    <Fragment>
      <div>
        <div className="d-flex justify-content-between mb-3"></div>
        <Row>
          {products.map((product) => (
            <Col key={product.ID} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="product-card">
                {product.image && (
                  <Card.Img
                    variant="top"
                    src={`http://localhost:3001${product.image}`}
                    alt={product.name}
                  />
                )}
                <Card.Body className="product-card-body">
                  <Card.Title className="product-card-title">
                    {product.name}
                  </Card.Title>

                  <Card.Text className="product-card-price">
                    ৳ {product.price.toLocaleString()} BDT
                    {product.oldPrice && (
                      <span className="product-card-old-price">
                        ৳ {product.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </Card.Text>
                  <div className="product-card-buttons">
                    <div className="product-card-button">
                      <Button
                        variant="primary"
                        onClick={() => addToCart(product)}
                      >
                        <FaCartPlus />
                      </Button>
                    </div>
                    <div className="product-card-button">
                      <Button variant="success">
                        <FaHeart />
                      </Button>
                    </div>
                    <div className="product-card-button">
                      <Link to={`/product/${product.ID}`}>
                        <Button variant="success">
                          <FaEye />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Fragment>
  );
};

export default ProductGrid;
