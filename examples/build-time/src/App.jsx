import { useState } from "react";
import { Button, IconButton } from "./components/Button";
import { Card, ProductCard } from "./components/Card";
import {
  Container,
  Grid,
  Flex,
  Header,
  Main,
  Footer,
} from "./components/Layout";

/**
 * 🎯 ZyraCSS Build-Time Example App
 *
 * This demonstrates Option A (Build-Time) usage where:
 * ✅ All ZyraCSS classes are static and defined in JSX
 * ✅ Classes get extracted during build and CSS is generated
 * ✅ Perfect for production builds with minimal runtime overhead
 * ✅ Optimized CSS bundles with only used styles
 */

function App() {
  const [cartCount, setCartCount] = useState(0);

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Premium Headphones",
      price: 299,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      description: "High-quality wireless headphones with noise cancellation.",
      features: ["Noise Cancellation", "30-hour Battery", "Wireless Charging"],
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 399,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      description: "Advanced fitness tracking and smart notifications.",
      features: ["Heart Rate Monitor", "GPS Tracking", "Water Resistant"],
    },
    {
      id: 3,
      name: "Laptop Stand",
      price: 79,
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
      description: "Ergonomic aluminum laptop stand for better posture.",
      features: ["Adjustable Height", "Aluminum Build", "Cable Management"],
    },
  ];

  const handleAddToCart = (product) => {
    setCartCount((prev) => prev + 1);
    console.log("Added to cart:", product.name);
  };

  return (
    <div className="min-height-[100vh] d-[flex] flex-direction-[column] bg-[#f8fafc]">
      {/* Header with navigation */}
      <Header sticky={true}>
        <Flex justify="between" align="center" className="w-[100%]">
          <div className="d-[flex] align-items-[center] gap-[16px]">
            <h1 className="font-size-[24px] font-weight-[700] c-[#1f2937] margin-[0]">
              🎯 ZyraCSS Store
            </h1>
            <span className="bg-[#10b981] c-[white] p-[4px,8px] border-radius-[12px] font-size-[12px] font-weight-[600]">
              Build-Time Mode
            </span>
          </div>

          <Flex align="center" gap={4}>
            <Button variant="secondary" size="small">
              Login
            </Button>
            <IconButton variant="primary" size="small" icon={<span>🛒</span>}>
              Cart ({cartCount})
            </IconButton>
          </Flex>
        </Flex>
      </Header>

      {/* Hero Section */}
      <Main>
        <div className="text-align-[center] margin-[0,0,48px,0]">
          <h2 className="font-size-[48px] font-weight-[900] c-[#1f2937] margin-[0,0,16px,0] line-height-[1.1]">
            Welcome to Build-Time CSS
          </h2>
          <p className="font-size-[20px] c-[#6b7280] margin-[0,auto,32px,auto] max-width-[600px] line-height-[1.6]">
            All styles are generated at build time, resulting in optimized CSS
            bundles and lightning-fast runtime performance.
          </p>

          <Flex justify="center" gap={4}>
            <Button variant="primary" size="large">
              Shop Now
            </Button>
            <Button variant="secondary" size="large">
              Learn More
            </Button>
          </Flex>
        </div>

        {/* Features Grid */}
        <div className="margin-[0,0,48px,0]">
          <h3 className="font-size-[32px] font-weight-[700] c-[#1f2937] text-align-[center] margin-[0,0,32px,0]">
            Why Choose Build-Time?
          </h3>

          <Grid cols={3} gap={6}>
            <Card
              title="⚡ Lightning Fast"
              className="text-align-[center] h-[100%]"
            >
              <p className="margin-[0,0,16px,0]">
                CSS is generated at build time, eliminating runtime overhead and
                ensuring maximum performance.
              </p>
              <div className="bg-[#dbeafe] p-[12px] border-radius-[8px] font-family-[monospace] font-size-[14px]">
                Build: 2.3s
                <br />
                Runtime: 0ms
              </div>
            </Card>

            <Card
              title="📦 Optimized Bundles"
              className="text-align-[center] h-[100%]"
            >
              <p className="margin-[0,0,16px,0]">
                Only the CSS you actually use gets included in the final bundle,
                keeping file sizes minimal and load times fast.
              </p>
              <div className="bg-[#dcfce7] p-[12px] border-radius-[8px] font-family-[monospace] font-size-[14px]">
                CSS Size: 12KB
                <br />
                Gzipped: 3KB
              </div>
            </Card>

            <Card
              title="🎯 Perfect for Production"
              className="text-align-[center] h-[100%]"
            >
              <p className="margin-[0,0,16px,0]">
                Ideal for production builds where performance is critical. All
                styles are pre-generated and optimized.
              </p>
              <div className="bg-[#fef3c7] p-[12px] border-radius-[8px] font-family-[monospace] font-size-[14px]">
                Lighthouse: 100
                <br />
                Core Web Vitals: ✅
              </div>
            </Card>
          </Grid>
        </div>

        {/* Products Section */}
        <div>
          <h3 className="font-size-[32px] font-weight-[700] c-[#1f2937] text-align-[center] margin-[0,0,32px,0]">
            Featured Products
          </h3>

          <Grid cols={3} gap={6}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </Grid>
        </div>

        {/* Code Example */}
        <div className="margin-[64px,0,0,0]">
          <Card className="bg-[#1f2937] c-[white]">
            <h4 className="font-size-[20px] font-weight-[600] margin-[0,0,16px,0] c-[#60a5fa]">
              💡 How Build-Time Works
            </h4>
            <pre className="font-family-[monospace] font-size-[14px] line-height-[1.5] overflow-x-[auto] margin-[0] c-[#e5e7eb]">
              {`// ✅ Static classes work perfectly with build-time scanning
<Button className="bg-[#3b82f6] c-[white] p-[12px,24px]">
  Click me
</Button>

// ✅ Conditional static classes also work great
const buttonStyle = isActive 
  ? "bg-[#059669] hover:bg-[#047857]" 
  : "bg-[#6b7280] hover:bg-[#4b5563]";

// ✅ Object-based static class selection
const sizeClasses = {
  small: "p-[8px,16px] font-size-[14px]",
  large: "p-[16px,32px] font-size-[18px]"
};`}
            </pre>
          </Card>
        </div>
      </Main>

      {/* Footer */}
      <Footer>
        <Flex justify="between" align="center">
          <div>
            <p className="margin-[0,0,8px,0] font-weight-[600]">
              ZyraCSS Build-Time Example
            </p>
            <p className="margin-[0] c-[#9ca3af] font-size-[14px]">
              Demonstrating static class extraction and build-time CSS
              generation
            </p>
          </div>

          <Flex gap={4}>
            <Button variant="secondary" size="small">
              Documentation
            </Button>
            <Button variant="secondary" size="small">
              GitHub
            </Button>
          </Flex>
        </Flex>
      </Footer>
    </div>
  );
}

export default App;
