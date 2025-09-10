/**
 * Card Component - Build-Time Example
 *
 * ✅ Uses static ZyraCSS classes perfect for build-time CSS generation
 * ✅ Demonstrates responsive design with pre-defined breakpoints
 * ✅ All animations and hover effects work seamlessly
 */

export function Card({ title, children, image, footer, className = "" }) {
  return (
    <div
      className={`bg-[white] border-radius-[12px] box-shadow-[0,4px,6px,-1px,rgba(0,0,0,0.1)] overflow-[hidden] ${className}`}
    >
      {image && (
        <div className="w-[100%] h-[200px] overflow-[hidden]">
          <img
            src={image}
            alt={title}
            className="w-[100%] h-[100%] object-fit-[cover] object-position-[center]"
          />
        </div>
      )}

      <div className="p-[24px]">
        {title && (
          <h3 className="font-size-[20px] font-weight-[600] c-[#1f2937] margin-[0,0,16px,0]">
            {title}
          </h3>
        )}

        <div className="c-[#6b7280] line-height-[1.6]">{children}</div>
      </div>

      {footer && (
        <div className="p-[16px,24px] bg-[#f9fafb] border-top-[1px,solid,#e5e7eb]">
          {footer}
        </div>
      )}
    </div>
  );
}

export function ProductCard({ product, onAddToCart }) {
  return (
    <Card
      title={product.name}
      image={product.image}
      className="transition-[transform,0.2s] hover:transform-[translateY(-4px)]"
      footer={
        <div className="d-[flex] justify-content-[space-between] align-items-[center]">
          <span className="font-size-[24px] font-weight-[700] c-[#059669]">
            ${product.price}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-[#3b82f6] c-[white] p-[8px,16px] border-radius-[6px] border-[none] cursor-[pointer] font-weight-[500] hover:bg-[#2563eb] transition-[background-color,0.2s]"
          >
            Add to Cart
          </button>
        </div>
      }
    >
      <p className="margin-[0,0,12px,0]">{product.description}</p>

      {product.features && (
        <ul className="margin-[0] p-[0] list-style-[none]">
          {product.features.map((feature, index) => (
            <li
              key={index}
              className="margin-[8px,0] p-[6px,0] border-left-[3px,solid,#3b82f6] p-left-[12px] c-[#4b5563]"
            >
              ✓ {feature}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
