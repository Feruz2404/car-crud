import React, { Component } from 'react';

export default class Car extends Component {
  constructor() {
    super();
    this.state = {
      brand: '',
      model: '',
      color: '',
      price: '',
      date: '',
      description: '',
      data: JSON.parse(localStorage.getItem('carData')) || [],
      editingId: null,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { brand, model, color, price, date, description, data, editingId } = this.state;

    const carData = {
      id: editingId || Date.now(),
      brand,
      model,
      color,
      price: parseInt(price).toLocaleString('en-US'),
      date,
      description,
    };

    if (editingId) {
      // Update existing car
      const updatedData = data.map((car) => (car.id === editingId ? carData : car));
      this.setState({ data: updatedData, editingId: null }, this.updateLocalStorage);
    } else {
      // Add new car
      this.setState({ data: [...data, carData] }, this.updateLocalStorage);
    }

    this.resetForm();
  };

  updateLocalStorage = () => {
    localStorage.setItem('carData', JSON.stringify(this.state.data));
  };

  handleDelete = (id) => {
    const updatedData = this.state.data.filter((car) => car.id !== id);
    this.setState({ data: updatedData }, this.updateLocalStorage);
  };

  handleEdit = (id) => {
    const carToEdit = this.state.data.find((car) => car.id === id);
    if (carToEdit) {
      this.setState({
        brand: carToEdit.brand,
        model: carToEdit.model,
        color: carToEdit.color,
        price: carToEdit.price.replace(/,/g, ''), // Remove commas for editing
        date: carToEdit.date,
        description: carToEdit.description,
        editingId: carToEdit.id,
      });
    }
  };

  resetForm = () => {
    this.setState({
      brand: '',
      model: '',
      color: '',
      price: '',
      date: '',
      description: '',
      editingId: null,
    });
  };

  render() {
    return (
      <div className="flex">
        <div className="w-80 h-screen bg-white p-5 shadow-md rounded-lg">
          <h2 className="mb-3 text-2xl font-bold text-gray-700">
            {this.state.editingId ? 'Edit Car' : 'Add New Car'}
          </h2>
          <form onSubmit={this.handleSubmit}>
            {['brand', 'model', 'color', 'price', 'date', 'description'].map((field) => (
              field === 'description' ? (
                <textarea
                  key={field}
                  value={this.state[field]}
                  onChange={(e) => this.setState({ [field]: e.target.value })}
                  className="w-full h-24 mb-3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Description"
                />
              ) : (
                <input
                  key={field}
                  type={field === 'price' ? 'number' : field === 'date' ? 'date' : 'text'}
                  value={this.state[field]}
                  onChange={(e) => this.setState({ [field]: e.target.value })}
                  className="w-full h-10 mb-3 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                />
              )
            ))}
            <button className="w-full h-10 mb-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              {this.state.editingId ? 'Update' : 'Create'}
            </button>
          </form>
        </div>

        <div className="p-5 flex flex-wrap gap-4 flex-1 items-start">
          {this.state.data.map((car) => (
            <div key={car.id} className="w-72 shadow-lg border rounded-md overflow-hidden bg-white p-2">
              <div className="w-full h-40 bg-gradient-to-r from-blue-500 to-blue-300 rounded-md"></div>
              <div className="p-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Brand: {car.brand}</h3>
                <p className="text-gray-600 mb-2">Model: {car.model}</p>
                <p className="text-gray-600 mb-2">Color: {car.color}</p>
                <p className="text-gray-600 mb-2">Date: {car.date}</p>
                <p className="text-gray-600 mb-2 line-clamp-1">Description: {car.description}</p>
                <p className="text-gray-800 font-bold">Price: {car.price} <span className="text-red-500">so'm</span></p>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    className="bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
                    onClick={() => this.handleDelete(car.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                    onClick={() => this.handleEdit(car.id)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
