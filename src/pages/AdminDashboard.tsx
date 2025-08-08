import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Settings, LogOut, Save, X } from 'lucide-react';
import { Course, PromoConfig, GalleryItem } from '../types';
import { storageUtils, storageEvents } from '../utils/storage';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [promo, setPromo] = useState<PromoConfig>({ text: '53% OFF. Use code: SAVE53', isActive: true });
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'courses' | 'promo' | 'gallery'>('courses');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [isAddingGalleryItem, setIsAddingGalleryItem] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedCourses, loadedPromo, loadedGallery] = await Promise.all([
          storageUtils.getCourses(),
          storageUtils.getPromo(),
          storageUtils.getGallery()
        ]);
        
        setCourses(loadedCourses);
        setPromo(loadedPromo);
        setGallery(loadedGallery);
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleSaveCourse = async (courseData: Partial<Course>) => {
    let updatedCourses: Course[];
    
    if (editingCourse) {
      // Update existing course
      updatedCourses = courses.map(course =>
        course.id === editingCourse.id
          ? { ...course, ...courseData }
          : course
      );
    } else {
      // Add new course
      const newCourse: Course = {
        id: Date.now().toString(),
        title: courseData.title || '',
        description: courseData.description || '',
        category: courseData.category || '',
        originalPrice: courseData.originalPrice || 0,
        discountPrice: courseData.discountPrice || 0,
        discountPercentage: courseData.discountPercentage || 0,
        thumbnail: courseData.thumbnail || '',
        createdAt: new Date().toISOString()
      };
      updatedCourses = [...courses, newCourse];
    }
    
    // Immediately update local state for instant UI feedback
    setCourses(updatedCourses);
    setEditingCourse(null);
    setIsAddingCourse(false);
    
    // Save to database in background
    await storageUtils.saveCourses(updatedCourses);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      const updatedCourses = courses.filter(course => course.id !== courseId);
      // Immediately update local state
      setCourses(updatedCourses);
      // Save to database in background
      await storageUtils.saveCourses(updatedCourses);
    }
  };

  const handleSavePromo = async () => {
    // Show immediate feedback
    alert('Promo settings saved successfully!');
    // Save to database
    await storageUtils.savePromo(promo);
  };

  const handleSaveGalleryItem = async (itemData: Partial<GalleryItem>) => {
    let updatedGallery: GalleryItem[];
    
    if (editingGalleryItem) {
      // Update existing gallery item
      updatedGallery = gallery.map(item =>
        item.id === editingGalleryItem.id
          ? { ...item, ...itemData }
          : item
      );
    } else {
      // Add new gallery item
      const newItem: GalleryItem = {
        id: Date.now().toString(),
        image: itemData.image || '',
        description: itemData.description || '',
        createdAt: new Date().toISOString()
      };
      updatedGallery = [...gallery, newItem];
    }
    
    // Immediately update local state for instant UI feedback
    setGallery(updatedGallery);
    setEditingGalleryItem(null);
    setIsAddingGalleryItem(false);
    
    // Save to database in background
    await storageUtils.saveGallery(updatedGallery);
  };

  const handleDeleteGalleryItem = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this gallery item?')) {
      const updatedGallery = gallery.filter(item => item.id !== itemId);
      // Immediately update local state
      setGallery(updatedGallery);
      // Save to database in background
      await storageUtils.saveGallery(updatedGallery);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'courses'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Manage Courses
          </button>
          <button
            onClick={() => setActiveTab('promo')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'promo'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Promo Settings
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'gallery'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Gallery
          </button>
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Courses ({courses.length})</h2>
              <button
                onClick={() => setIsAddingCourse(true)}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <Plus size={20} />
                <span>Add Course</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{course.category}</p>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-green-600 font-bold">₹{course.discountPrice}</span>
                      <span className="text-gray-400 line-through">₹{course.originalPrice}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                      >
                        <Edit size={16} className="inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                      >
                        <Trash2 size={16} className="inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Promo Tab */}
        {activeTab === 'promo' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Promo Banner Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Text
                </label>
                <input
                  type="text"
                  value={promo.text}
                  onChange={(e) => setPromo({ ...promo, text: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter promo text"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="promoActive"
                  checked={promo.isActive}
                  onChange={(e) => setPromo({ ...promo, isActive: e.target.checked })}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="promoActive" className="text-sm font-medium text-gray-700">
                  Show promo banner
                </label>
              </div>

              <button
                onClick={handleSavePromo}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Save size={20} />
                <span>Save Promo Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Course Gallery ({gallery.length})</h2>
              <button
                onClick={() => setIsAddingGalleryItem(true)}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <Plus size={20} />
                <span>Add Screenshot</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.description}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{item.description}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingGalleryItem(item)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                      >
                        <Edit size={16} className="inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGalleryItem(item.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                      >
                        <Trash2 size={16} className="inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {gallery.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500 text-lg mb-4">No gallery items yet</p>
                <p className="text-gray-400">Add course screenshots and previews to showcase your content</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Course Form Modal */}
      {(editingCourse || isAddingCourse) && (
        <CourseFormModal
          course={editingCourse}
          onSave={handleSaveCourse}
          onClose={() => {
            setEditingCourse(null);
            setIsAddingCourse(false);
          }}
        />
      )}

      {/* Gallery Form Modal */}
      {(editingGalleryItem || isAddingGalleryItem) && (
        <GalleryFormModal
          item={editingGalleryItem}
          onSave={handleSaveGalleryItem}
          onClose={() => {
            setEditingGalleryItem(null);
            setIsAddingGalleryItem(false);
          }}
        />
      )}
    </div>
  );
};

// Course Form Modal Component
interface CourseFormModalProps {
  course: Course | null;
  onSave: (courseData: Partial<Course>) => void;
  onClose: () => void;
}

const CourseFormModal: React.FC<CourseFormModalProps> = ({ course, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    category: course?.category || '',
    originalPrice: course?.originalPrice || 0,
    discountPrice: course?.discountPrice || 0,
    thumbnail: course?.thumbnail || ''
  });

  const discountPercentage = formData.originalPrice > 0 
    ? Math.round(((formData.originalPrice - formData.discountPrice) / formData.originalPrice) * 100)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      discountPercentage
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {course ? 'Edit Course' : 'Add New Course'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                <option value="Forex Courses">Forex Courses</option>
                <option value="Option Trading">Option Trading</option>
                <option value="Swing Trading">Swing Trading</option>
                <option value="Technical Trader">Technical Trader</option>
                <option value="Price Action">Price Action</option>
                <option value="Fundamentals">Fundamentals</option>
                <option value="SMC & ICT">SMC & ICT</option>
                <option value="For Beginners">For Beginners</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {discountPercentage > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-700 font-medium">
                  Discount: {discountPercentage}% OFF
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Thumbnail
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData({ ...formData, thumbnail: event.target?.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.thumbnail && (
                  <div className="mt-2">
                    <img
                      src={formData.thumbnail}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  Upload a 16:9 aspect ratio image for best results
                </p>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {course ? 'Update Course' : 'Add Course'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// Gallery Form Modal Component
interface GalleryFormModalProps {
  item: GalleryItem | null;
  onSave: (itemData: Partial<GalleryItem>) => void;
  onClose: () => void;
}

const GalleryFormModal: React.FC<GalleryFormModalProps> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    image: item?.image || '',
    description: item?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {item ? 'Edit Gallery Item' : 'Add New Screenshot'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Screenshot (16:9 recommended)
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData({ ...formData, image: event.target?.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={!item}
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  Upload a 16:9 aspect ratio image for best results
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of the course content or screenshot..."
                required
                maxLength={200}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/200 characters
              </p>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {item ? 'Update Screenshot' : 'Add Screenshot'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;