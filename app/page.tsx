import Image from "next/image";

export default function TestPage() {
  return (
    <div className="p-8">
      <button className="btn">Normal Button</button>
      <button className="btn btn-primary">Primary Button</button>
      <button className="btn btn-secondary">Secondary Button</button>
      <button className="btn btn-accent">Accent Button</button>
      
      <div className="card w-96 bg-base-100 shadow-xl mt-4">
        <div className="card-body">
          <h2 className="card-title">Card Title</h2>
          <p>If you can see styled buttons and this card, DaisyUI is working!</p>
        </div>
      </div>
    </div>
  )
}
