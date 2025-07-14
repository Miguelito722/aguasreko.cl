import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Upload, 
  Image as ImageIcon, 
  Save, 
  Trash2, 
  Eye, 
  EyeOff, 
  Plus,
  Edit3,
  CheckCircle,
  AlertCircle,
  Settings,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';

const ConfigurationPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Load products from localStorage or use default products
    const savedProducts = localStorage.getItem('aguasreko_products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Load default products
      import('../data/products').then(({ products: defaultProducts }) => {
        setProducts(defaultProducts);
      });
    }
  }, []);

  const saveProducts = (updatedProducts: Product[]) => {
    localStorage.setItem('aguasreko_products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    
    // Also update the main products data
    localStorage.setItem('aguasreko_products_updated', 'true');
  };

  const handleImageUpdate = (productId: string, newImageUrl: string) => {
    const updatedProducts = products.map(product =>
      product.id === productId
        ? { ...product, image: newImageUrl }
        : product
    );
    
    saveProducts(updatedProducts);
    setMessage({ type: 'success', text: 'Imagen actualizada correctamente' });
    
    setTimeout(() => setMessage(null), 3000);
  };

  const handleProductUpdate = (productId: string, updates: Partial<Product>) => {
    const updatedProducts = products.map(product =>
      product.id === productId
        ? { ...product, ...updates }
        : product
    );
    
    saveProducts(updatedProducts);
    setMessage({ type: 'success', text: 'Producto actualizado correctamente' });
    
    setTimeout(() => setMessage(null), 3000);
  };

  const addNewProduct = () => {
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: 'Nuevo Producto',
      price: 0,
      description: 'Descripción del nuevo producto',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=1000&auto=format&fit=crop',
      category: 'bidon'
    };
    
    const updatedProducts = [...products, newProduct];
    saveProducts(updatedProducts);
    setSelectedProduct(newProduct);
    setIsEditing(true);
  };

  const deleteProduct = (productId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const updatedProducts = products.filter(product => product.id !== productId);
      saveProducts(updatedProducts);
      setSelectedProduct(null);
      setMessage({ type: 'success', text: 'Producto eliminado correctamente' });
      
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-6">Debes estar autenticado para acceder a la configuración.</p>
          <button
            onClick={() => window.close()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => window.close()}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Cerrar</span>
              </motion.button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Configuración de Productos</h1>
                  <p className="text-gray-600">Gestiona las imágenes y detalles de tus productos</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setPreviewMode(!previewMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                  previewMode
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {previewMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span>{previewMode ? 'Vista Previa' : 'Modo Edición'}</span>
              </motion.button>
              
              <motion.button
                onClick={addNewProduct}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="h-4 w-4" />
                <span>Nuevo Producto</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {message && (
        <motion.div
          className={`fixed top-20 right-6 z-50 p-4 rounded-xl shadow-lg flex items-center space-x-3 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
        >
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </motion.div>
      )}

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Products List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Lista de Productos</span>
              </h2>
              
              <div className="space-y-3">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedProduct?.id === product.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedProduct(product)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Editor */}
          <div className="lg:col-span-2">
            {selectedProduct ? (
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isEditing ? 'Editando Producto' : selectedProduct.name}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-200 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>{isEditing ? 'Cancelar' : 'Editar'}</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => deleteProduct(selectedProduct.id)}
                      className="flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-xl hover:bg-red-200 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Eliminar</span>
                    </motion.button>
                  </div>
                </div>

                {isEditing ? (
                  <ProductEditor
                    product={selectedProduct}
                    onSave={(updates) => {
                      handleProductUpdate(selectedProduct.id, updates);
                      setIsEditing(false);
                    }}
                    onCancel={() => setIsEditing(false)}
                  />
                ) : (
                  <ProductPreview
                    product={selectedProduct}
                    onImageUpdate={(newImageUrl) => handleImageUpdate(selectedProduct.id, newImageUrl)}
                  />
                )}
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Selecciona un Producto
                </h3>
                <p className="text-gray-600">
                  Elige un producto de la lista para ver y editar sus detalles
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Preview Component
const ProductPreview: React.FC<{
  product: Product;
  onImageUpdate: (newImageUrl: string) => void;
}> = ({ product, onImageUpdate }) => {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newImageUrl.trim()) {
      onImageUpdate(newImageUrl.trim());
      setNewImageUrl('');
      setShowImageUpload(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded-2xl"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=1000&auto=format&fit=crop';
          }}
        />
        <motion.button
          onClick={() => setShowImageUpload(!showImageUpload)}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Upload className="h-5 w-5 text-gray-700" />
        </motion.button>
      </div>

      {/* Image Upload Form */}
      {showImageUpload && (
        <motion.form
          onSubmit={handleImageSubmit}
          className="bg-gray-50 rounded-xl p-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nueva URL de Imagen
          </label>
          <div className="flex space-x-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://ejemplo.com/imagen.jpg"
              required
            />
            <motion.button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.form>
      )}

      {/* Product Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Información del Producto</h3>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600">Nombre:</span>
              <p className="font-medium">{product.name}</p>
            </div>
            <div>
              <span className="text-gray-600">Precio:</span>
              <p className="font-medium text-green-600">{formatPrice(product.price)}</p>
            </div>
            <div>
              <span className="text-gray-600">Categoría:</span>
              <p className="font-medium capitalize">{product.category}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      </div>
    </div>
  );
};

// Product Editor Component
const ProductEditor: React.FC<{
  product: Product;
  onSave: (updates: Partial<Product>) => void;
  onCancel: () => void;
}> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    description: product.description,
    image: product.image,
    category: product.category
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Producto
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio (CLP)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            step="100"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categoría
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="bidon">Bidón</option>
          <option value="dispensador">Dispensador</option>
          <option value="botellas">Botellas</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL de Imagen
        </label>
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://ejemplo.com/imagen.jpg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* Image Preview */}
      {formData.image && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vista Previa de Imagen
          </label>
          <img
            src={formData.image}
            alt="Vista previa"
            className="w-full h-48 object-cover rounded-xl"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3';
            }}
          />
        </div>
      )}

      <div className="flex space-x-4">
        <motion.button
          type="submit"
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save className="h-5 w-5" />
          <span>Guardar Cambios</span>
        </motion.button>

        <motion.button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Cancelar
        </motion.button>
      </div>
    </form>
  );
};

export default ConfigurationPage;