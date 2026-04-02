import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, LogOut, Plus, Search, Trash2, WandSparkles } from 'lucide-react';
import { allServiceSections } from '../data/servicesData';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../components/NotificationProvider';

export default function AdminPanel() {
  const { showToast, confirm } = useNotifications();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState('vouchers'); // 'vouchers', 'services', or 'promotions'
  
  // VOUCHER STATE
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formValues, setFormValues] = useState({ studentName: '', idCardNumber: '', contact: '' });
  
  // SERVICE STATE
  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState({ category: 'Women', subcategory: '', name: '', price: '' });
  const [isEditingService, setIsEditingService] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState(null);
  const [serviceSearch, setServiceSearch] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});
  
  // PROMOTIONS STATE
  const [promotions, setPromotions] = useState([]);
  const [promoForm, setPromoForm] = useState({ text: '', link: '', isActive: true, type: 'classic' });
  const [isEditingPromo, setIsEditingPromo] = useState(false);
  const [currentPromoId, setCurrentPromoId] = useState(null);

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const [isSaving, setIsSaving] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);

  const scriptUrl = import.meta.env.VITE_GOOGLE_SHEETS_URL;
  const adminUser = import.meta.env.VITE_ADMIN_USER;
  const adminPass = import.meta.env.VITE_ADMIN_PASS;

  useEffect(() => {
    const authStatus = sessionStorage.getItem('jiya_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const getThemeState = () =>
      document.documentElement.classList.contains('theme-light') ||
      document.body.classList.contains('theme-light');
    const updateThemeState = () => setIsLightTheme(getThemeState());
    updateThemeState();
    const observer = new MutationObserver(updateThemeState);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === adminUser && loginForm.password === adminPass) {
      setIsAuthenticated(true);
      sessionStorage.setItem('jiya_admin_auth', 'true');
      setLoginError('');
      showToast('Admin access granted.', { tone: 'success', title: 'Signed In' });
    } else {
      setLoginError('Invalid credentials. Access denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('jiya_admin_auth');
    showToast('You have been signed out of the admin panel.', { tone: 'info', title: 'Signed Out' });
  };

  const fetchStudents = async () => {
    if (!scriptUrl) return;
    try {
      setLoading(true);
      const resp = await fetch(`${scriptUrl}?entity=Students`);
      const data = await resp.json();
      if (data.status === 'success') {
        setStudents(data.data || []);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch student records.');
      }
    } catch (err) {
      setError('Error fetching data. Check connection to Google API.');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    if (!scriptUrl) return;
    try {
      setLoading(true);
      const resp = await fetch(`${scriptUrl}?entity=Services`);
      const data = await resp.json();
      if (data.status === 'success') {
        setServices(data.data || []);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch services.');
      }
    } catch (err) {
      setError('Error fetching services.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    if (!scriptUrl) return;
    try {
      setLoading(true);
      const resp = await fetch(`${scriptUrl}?entity=Promotions`);
      const data = await resp.json();
      if (data.status === 'success') {
        setPromotions(data.data || []);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch promotions.');
      }
    } catch (err) {
      setError('Error fetching promotions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStudents();
      fetchServices();
      fetchPromotions();
      const interval = setInterval(() => {
        if (activeTab === 'vouchers') fetchStudents();
        else if (activeTab === 'services') fetchServices();
        else fetchPromotions();
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, activeTab]);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    if (!scriptUrl) return;
    setIsSaving(true);
    try {
       const payload = {
         action: isEditing ? 'update' : 'create',
         entity: 'Students',
         studentName: formValues.studentName,
         idCardNumber: formValues.idCardNumber,
         contact: formValues.contact
       };
       if (isEditing) payload.id = currentId;

       await fetch(scriptUrl, {
         method: 'POST',
         mode: 'no-cors',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload),
       });
       
       await fetchStudents();
       setFormValues({ studentName: '', idCardNumber: '', contact: '' });
       setIsEditing(false);
       setCurrentId(null);
       showToast(isEditing ? 'Student record updated successfully.' : 'Student record saved successfully.', { tone: 'success', title: 'Saved' });
    } catch (err) {
       console.error('Failed saving', err);
       showToast('Failed to save record.', { tone: 'error', title: 'Save Failed' });
    } finally {
       setIsSaving(false);
    }
  };

  const handleEdit = (student) => {
    setIsEditing(true);
    setCurrentId(student.id);
    setFormValues({ 
      studentName: student.studentName, 
      idCardNumber: student.idCardNumber,
      contact: student.contact || student.contactNumber || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const approved = await confirm({
      title: 'Delete student record?',
      message: 'This will permanently remove the selected student record from the registry.',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep',
      tone: 'danger',
    });
    if (!approved) return;
    if (!scriptUrl) return;
    try {
      await fetch(scriptUrl, {
         method: 'POST',
         mode: 'no-cors',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ action: 'delete', id, entity: 'Students' }),
      });
      await fetchStudents();
      showToast('Student record deleted.', { tone: 'success', title: 'Deleted' });
    } catch (err) {
      setError('Failed to delete student.');
      showToast('Failed to delete student.', { tone: 'error', title: 'Delete Failed' });
    }
  };

  const importServices = async () => {
    if (!scriptUrl) return;
    const approved = await confirm({
      title: 'Import official service menu?',
      message: 'This will import all existing website services into your Google Sheet. Continue?',
      confirmLabel: 'Import',
      cancelLabel: 'Cancel',
    });
    if (!approved) return;
    try {
      setIsSaving(true);
      // We'll import them one-by-one or in batches. Since Google Sheets POST is slow, 
      // we'll do them sequentially.
      for (const section of allServiceSections) {
        for (const item of section.items) {
          const payload = {
            action: 'create',
            entity: 'Services',
            category: section.groupKey === 'women' ? 'Women' : section.groupKey === 'hair' ? 'Hair' : 'Men',
            subcategory: section.title,
            name: item.name,
            price: item.price
          };
          await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        }
      }
      showToast('Import complete. Refreshing the service list now.', { tone: 'success', title: 'Import Finished' });
      await fetchServices();
    } catch (err) {
      setError('Failed to import services.');
      showToast('Failed to import services.', { tone: 'error', title: 'Import Failed' });
    } finally {
      setIsSaving(false);
    }
  };
  const handleCreateOrUpdateService = async (e) => {
    e.preventDefault();
    if (!scriptUrl) return;

    try {
      setIsSaving(true);
      const payload = {
        action: isEditingService ? 'update' : 'create',
        entity: 'Services',
        ...serviceForm
      };
      if (isEditingService) payload.id = currentServiceId;

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setServiceForm({ category: 'Women', subcategory: '', name: '', price: '' });
      setIsEditingService(false);
      setCurrentServiceId(null);
      await fetchServices();
      showToast(isEditingService ? 'Service updated successfully.' : 'Service added successfully.', { tone: 'success', title: 'Saved' });
    } catch (err) {
      setError('Failed to save service.');
      showToast('Failed to save service.', { tone: 'error', title: 'Save Failed' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditService = (service) => {
    setIsEditingService(true);
    setCurrentServiceId(service.id);
    setServiceForm({
      category: service.category || 'Women',
      subcategory: service.subcategory || '',
      name: service.name || '',
      price: service.price || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteService = async (id) => {
    const approved = await confirm({
      title: 'Delete service?',
      message: 'This service entry will be removed from the live admin list.',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep',
      tone: 'danger',
    });
    if (!approved) return;
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id, entity: 'Services' }),
      });
      await fetchServices();
      showToast('Service deleted.', { tone: 'success', title: 'Deleted' });
    } catch (err) {
      setError('Failed to delete service.');
      showToast('Failed to delete service.', { tone: 'error', title: 'Delete Failed' });
    }
  };

  const handleCreateOrUpdatePromo = async (e) => {
    e.preventDefault();
    if (!scriptUrl) return;
    try {
      setIsSaving(true);
      const payload = {
        action: isEditingPromo ? 'update' : 'create',
        entity: 'Promotions',
        ...promoForm
      };
      if (isEditingPromo) payload.id = currentPromoId;

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setPromoForm({ text: '', link: '', isActive: true, type: 'classic' });
      setIsEditingPromo(false);
      setCurrentPromoId(null);
      await fetchPromotions();
      showToast(isEditingPromo ? 'Promotion updated successfully.' : 'Promotion created successfully.', { tone: 'success', title: 'Saved' });
    } catch (err) {
      setError('Failed to save promotion.');
      showToast('Failed to save promotion.', { tone: 'error', title: 'Save Failed' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePromotion = async (id) => {
    const approved = await confirm({
      title: 'Delete promotion?',
      message: 'This banner will be removed from the promotions list.',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep',
      tone: 'danger',
    });
    if (!approved) return;
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id, entity: 'Promotions' }),
      });
      await fetchPromotions();
      showToast('Promotion deleted.', { tone: 'success', title: 'Deleted' });
    } catch (err) {
      setError('Failed to delete promotion.');
      showToast('Failed to delete promotion.', { tone: 'error', title: 'Delete Failed' });
    }
  };

  const pageStyle = isLightTheme
    ? {
        fontFamily: "'Montserrat', sans-serif",
        background: 'linear-gradient(180deg, #fdfaf5 0%, #f6efe4 100%)',
        color: '#21180f',
      }
    : {
        fontFamily: "'Montserrat', sans-serif",
        background: '#050505',
        color: '#ffffff',
      };
      
  const cardStyle = isLightTheme
    ? {
        background: '#ffffff',
        borderColor: 'rgba(181, 142, 76, 0.18)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
      }
    : {
        backgroundColor: '#0f0f0f',
        borderColor: 'rgba(255,255,255,0.05)',
      };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6" style={pageStyle}>
        <Motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-[2.5rem] border p-12 shadow-2xl"
          style={cardStyle}
        >
          <div className="mb-10 text-center">
            <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border bg-accent/5 ${isLightTheme ? 'border-accent/40' : 'border-[#CBB279]/30'}`}>
              <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
            </div>
            <h2 className={`text-[0.65rem] uppercase tracking-[0.4em] mb-3 ${isLightTheme ? 'text-[#8c6a2d]' : 'text-[#CBB279]'}`}>Restricted Access</h2>
            <h1 className="text-3xl italic" style={{ fontFamily: "'Bodoni Moda', serif" }}>Admin Login</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="text"
                required
                placeholder="Username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className={`w-full border-b bg-transparent py-4 outline-none transition-all focus:border-[#CBB279] ${isLightTheme ? 'border-black/20 text-black placeholder:text-black/40' : 'border-white/10 text-white placeholder:text-white/30'}`}
              />
            </div>
            <div>
              <input
                type="password"
                required
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className={`w-full border-b bg-transparent py-4 outline-none transition-all focus:border-[#CBB279] ${isLightTheme ? 'border-black/20 text-black placeholder:text-black/40' : 'border-white/10 text-white placeholder:text-white/30'}`}
              />
            </div>
            {loginError && <p className="text-xs text-red-600 font-medium">{loginError}</p>}
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-[#8A6E2F] to-[#CBB279] py-4 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-black transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>
           <p className={`mt-8 text-center text-[0.6rem] uppercase tracking-[0.1em] ${isLightTheme ? 'text-black/50' : 'opacity-30'}`}>Verification required for management</p>
        </Motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-12 pt-12 md:px-12 md:pb-20 md:pt-16" style={pageStyle}>
      <div className="mx-auto max-w-7xl">
         <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
                <h2 className="text-sm uppercase tracking-[0.4em] text-[#CBB279]">Jiya's Studio Admin</h2>
              </div>
              <h1 className="text-4xl italic md:text-5xl" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                 Management Console
              </h1>
            </div>
            <button 
              onClick={handleLogout}
              className="px-6 py-2 rounded-full border border-red-500/20 text-red-400 text-[0.65rem] uppercase tracking-widest hover:bg-red-500/5 transition-all w-fit"
            >
              Log Out
            </button>
         </div>

         <div className="grid gap-8">
            <Motion.div 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
               className="rounded-[2rem] border p-8 shadow-sm"
               style={cardStyle}
            >
               {error && (
                 <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                    <p className="font-semibold uppercase tracking-widest text-[0.6rem] mb-1">Configuration Error</p>
                    <p className="opacity-80">{error}</p>
                 </div>
               )}

               <div className="mb-10 flex gap-6 border-b border-[#CBB279]/20 overflow-x-auto">
                  <button 
                    onClick={() => setActiveTab('vouchers')}
                    className={`pb-4 text-xs uppercase tracking-[0.3em] transition-all ${activeTab === 'vouchers' ? 'text-[#CBB279] border-b-2 border-[#CBB279]' : 'text-[#baa98e] opacity-50'}`}
                  >
                    Student Vouchers
                  </button>
                  <button 
                    onClick={() => setActiveTab('services')}
                    className={`pb-4 text-xs uppercase tracking-[0.3em] transition-all ${activeTab === 'services' ? 'text-[#CBB279] border-b-2 border-[#CBB279]' : 'text-[#baa98e] opacity-50'}`}
                  >
                    Service Menu
                  </button>
                  <button 
                    onClick={() => setActiveTab('promotions')}
                    className={`pb-4 text-xs uppercase tracking-[0.3em] transition-all ${activeTab === 'promotions' ? 'text-[#CBB279] border-b-2 border-[#CBB279]' : 'text-[#baa98e] opacity-50'}`}
                  >
                    Promotions
                  </button>
               </div>

               <div className={`mb-8 rounded-[1.4rem] border px-5 py-4 text-sm leading-7 ${isLightTheme ? 'border-black/6 bg-black/[0.02] text-[#5f4a34]' : 'border-white/6 bg-white/[0.02] text-[#d6c9b4]'}`}>
                 Use this panel for day-to-day updates only. Keep real contact details, live promotions, and service pricing aligned with the public website before handover.
               </div>

               {activeTab === 'vouchers' ? (
                 <div className="space-y-12">
                   {/* VOUCHER FORM */}
                   <div className={`rounded-3xl border p-8 ${isLightTheme ? 'bg-[#fcfaf7] border-black/5' : 'bg-[#1e1a15]/40 border-white/5'}`}>
                      <h4 className="mb-6 text-sm uppercase tracking-widest text-[#CBB279]">{isEditing ? 'Update Student Record' : 'Register New Student'}</h4>
                      <form onSubmit={handleCreateOrUpdate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                        <div className="md:col-span-1">
                          <label className="mb-2 block text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Legal Name</label>
                          <input
                            required
                            type="text"
                            value={formValues.studentName}
                            onChange={(e) => setFormValues({...formValues, studentName: e.target.value})}
                            className={`w-full border-b bg-transparent py-2 text-lg font-light outline-none focus:border-[#CBB279] ${isLightTheme ? 'border-black/10' : 'border-white/10'}`}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Student ID</label>
                          <input
                            required
                            type="text"
                            value={formValues.idCardNumber}
                            onChange={(e) => setFormValues({...formValues, idCardNumber: e.target.value})}
                            className={`w-full border-b bg-transparent py-2 text-lg font-light outline-none focus:border-[#CBB279] ${isLightTheme ? 'border-black/10' : 'border-white/10'}`}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Contact Number</label>
                          <input
                            type="tel"
                            value={formValues.contact}
                            onChange={(e) => setFormValues({...formValues, contact: e.target.value})}
                            className={`w-full border-b bg-transparent py-2 text-lg font-light outline-none focus:border-[#CBB279] ${isLightTheme ? 'border-black/10' : 'border-white/10'}`}
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                              type="submit"
                              disabled={isSaving}
                              className="rounded-full bg-[#CBB279] px-6 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#d6b167] disabled:opacity-50"
                            >
                              {isSaving ? 'Processing...' : (isEditing ? 'Update' : 'Register')}
                            </button>
                            {isEditing && (
                              <button 
                                type="button" 
                                onClick={() => { setIsEditing(false); setFormValues({ studentName: '', idCardNumber: '', contact: '' }); }}
                                className="text-[0.6rem] uppercase tracking-widest text-[#baa98e] hover:underline"
                              >
                                Cancel
                              </button>
                            )}
                        </div>
                      </form>
                   </div>

                   {/* VOUCHER LIST */}
                   <div>
                      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <h3 className="text-xl italic" style={{ fontFamily: "'Bodoni Moda', serif" }}>Pass Registry</h3>
                          
                          <div className="flex flex-1 max-w-md w-full items-center gap-3">
                            <input 
                              type="text" 
                              placeholder="Search by Name, ID, or Contact..." 
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className={`flex-1 bg-transparent border-b py-1 text-xs outline-none transition-all focus:border-[#CBB279] ${isLightTheme ? 'border-black/10' : 'border-white/10'}`}
                            />
                            <button onClick={fetchStudents} disabled={loading} className="text-[0.6rem] uppercase tracking-widest text-[#CBB279] hover:underline disabled:opacity-50">
                              {loading ? 'Syncing...' : 'Sync Data'}
                            </button>
                          </div>
                      </div>
                      
                      <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                          <thead>
                            <tr className="border-b border-[#CBB279]/10 text-[0.6rem] uppercase tracking-[0.2em] opacity-40">
                              <th className="px-4 py-4 font-normal">Legal Name</th>
                              <th className="px-4 py-4 font-normal">ID Card Number</th>
                              <th className="px-4 py-4 font-normal">Contact</th>
                              <th className="px-4 py-4 font-normal">ID Code</th>
                              <th className="px-4 py-4 font-normal">Created</th>
                              <th className="px-4 py-4 font-normal text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                              {students.length === 0 && !loading && !error && (
                                <tr>
                                  <td colSpan="6" className="py-20 text-center text-sm font-light italic opacity-30">
                                    No data found in the cloud registry.
                                  </td>
                                </tr>
                              )}
                              {students
                                .filter(s => 
                                  s.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  s.idCardNumber?.toString().includes(searchTerm) ||
                                  s.id?.toString().includes(searchTerm) ||
                                  (s.contact || s.contactNumber)?.toString().includes(searchTerm)
                                )
                                .map((student, idx) => (
                                <tr key={student.id || idx} className="border-b border-[#CBB279]/5 hover:bg-white/[0.01] transition-all">
                                    <td className="px-4 py-5 text-base" style={{ fontFamily: "'Bodoni Moda', serif" }}>{student.studentName}</td>
                                    <td className="px-4 py-5 font-mono text-[0.75rem] opacity-65">{student.idCardNumber}</td>
                                    <td className="px-4 py-5 font-mono text-[0.75rem] opacity-65">{student.contact || student.contactNumber || 'N/A'}</td>
                                    <td className="px-4 py-5 font-bold text-[#CBB279] text-[0.7rem] tracking-widest">{student.id}</td>
                                    <td className="px-4 py-5 text-[0.7rem] opacity-40">{student.timestamp ? new Date(student.timestamp).toLocaleDateString() : 'N/A'}</td>
                                    <td className="px-4 py-5 text-right">
                                      <button onClick={() => handleEdit(student)} className="mr-4 text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Edit</button>
                                      <button onClick={() => handleDelete(student.id)} className="text-[0.6rem] uppercase tracking-widest text-red-500/70">Delete</button>
                                    </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                   </div>
                 </div>
               ) : activeTab === 'services' ? (
                 <div className="space-y-12">
                   {/* SERVICE FORM */}
                   <div className={`rounded-3xl border p-8 ${isLightTheme ? 'bg-[#fcfaf7] border-black/5' : 'bg-[#1e1a15]/40 border-white/5'}`}>
                      <h4 className="mb-6 text-sm uppercase tracking-widest text-[#CBB279]">{isEditingService ? 'Update Service' : 'Add New Service'}</h4>
                      <form onSubmit={handleCreateOrUpdateService} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
                        <div>
                          <label className="mb-2 block text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Category</label>
                          <select 
                            value={serviceForm.category}
                            onChange={(e) => setServiceForm({...serviceForm, category: e.target.value})}
                            className={`w-full border-b bg-transparent py-2 text-lg font-light outline-none focus:border-[#CBB279] ${isLightTheme ? 'border-black/10' : 'border-white/10'}`}
                          >
                            <option value="Women" style={{ background: '#121212' }}>Women's services</option>
                            <option value="Hair" style={{ background: '#121212' }}>Hair studio</option>
                            <option value="Men" style={{ background: '#121212' }}>Men's grooming</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-2 block text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Subcategory</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. Skin Facial"
                            value={serviceForm.subcategory}
                            onChange={(e) => setServiceForm({...serviceForm, subcategory: e.target.value})}
                            className={`w-full border-b bg-transparent py-2 text-sm font-light outline-none focus:border-[#CBB279] ${isLightTheme ? 'border-black/10' : 'border-white/10'}`}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Service Name</label>
                          <input
                            required
                            type="text"
                            value={serviceForm.name}
                            onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                            className={`w-full border-b bg-transparent py-2 text-sm font-light outline-none focus:border-[#CBB279] ${isLightTheme ? 'border-black/10' : 'border-white/10'}`}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Price (Rs.)</label>
                          <input
                            required
                            type="text"
                            value={serviceForm.price}
                            onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                            className={`w-full border-b bg-transparent py-2 text-sm font-light outline-none focus:border-[#CBB279] ${isLightTheme ? 'border-black/10' : 'border-white/10'}`}
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                              type="submit"
                              disabled={isSaving}
                              className="rounded-full bg-[#CBB279] px-6 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#d6b167] disabled:opacity-50"
                            >
                              {isSaving ? 'Processing...' : (isEditingService ? 'Update' : 'Add Service')}
                            </button>
                            {isEditingService && (
                              <button 
                                type="button" 
                                onClick={() => { setIsEditingService(false); setServiceForm({ category: 'Women', subcategory: '', name: '', price: '' }); }}
                                className="text-[0.6rem] uppercase tracking-widest text-[#baa98e] hover:underline"
                              >
                                Cancel
                              </button>
                            )}
                        </div>
                      </form>
                   </div>

                   {/* SERVICE LIST */}
                   <div>
                      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <h3 className="text-xl italic" style={{ fontFamily: "'Bodoni Moda', serif" }}>Service Menu</h3>
                          
                          <div className="flex flex-1 max-w-md w-full items-center gap-3">
                            <input 
                              type="text" 
                              placeholder="Search by Name, Category..." 
                              value={serviceSearch}
                              onChange={(e) => setServiceSearch(e.target.value)}
                              className={`flex-1 bg-transparent border-b py-1 text-xs outline-none transition-all focus:border-[#CBB279] ${isLightTheme ? 'border-black/10' : 'border-white/10'}`}
                            />
                            <button onClick={fetchServices} disabled={loading} className="text-[0.6rem] uppercase tracking-widest text-[#CBB279] hover:underline disabled:opacity-50">
                              {loading ? 'Syncing...' : 'Sync Data'}
                            </button>
                            <button onClick={importServices} disabled={loading || isSaving} className="text-[0.6rem] uppercase tracking-widest text-[#666] hover:text-[#CBB279] transition-colors disabled:opacity-30">
                              Import Official Menu
                            </button>
                          </div>
                      </div>
                      
                      <div className="space-y-6">
                              {services.length === 0 && !loading && !error && (
                                <div className="py-20 text-center text-sm font-light italic opacity-30">
                                  No services found.
                                </div>
                              )}
                              
                              {/* Grouping Logic */}
                              {Object.entries(
                                services
                                  .filter(s => 
                                    s.name?.toLowerCase().includes(serviceSearch.toLowerCase()) || 
                                    s.category?.toLowerCase().includes(serviceSearch.toLowerCase()) ||
                                    s.subcategory?.toLowerCase().includes(serviceSearch.toLowerCase())
                                  )
                                  .reduce((acc, s) => {
                                    const key = `${s.category} > ${s.subcategory}`;
                                    if (!acc[key]) acc[key] = [];
                                    acc[key].push(s);
                                    return acc;
                                  }, {})
                              ).map(([groupName, items]) => {
                                const isExpanded = expandedGroups[groupName] || serviceSearch.length > 0;
                                return (
                                  <div key={groupName} className={`rounded-[2.5rem] border transition-all ${isLightTheme ? 'bg-white border-black/5' : 'bg-[#1e1a15]/40 border-white/5'}`}>
                                    {/* Category Card Header */}
                                    <button 
                                      onClick={() => toggleGroup(groupName)}
                                      className="flex w-full items-center justify-between p-8 text-left transition-all hover:bg-white/[0.02]"
                                    >
                                      <div className="flex items-center gap-6">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#CBB279]/10 text-[#CBB279]">
                                          <WandSparkles className="h-6 w-6" />
                                        </div>
                                        <div>
                                          <h6 className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-[#CBB279]">
                                            {groupName.split(' > ')[0]}
                                          </h6>
                                          <h4 className="text-xl font-medium" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                                            {groupName.split(' > ')[1]}
                                          </h4>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <span className="text-[0.6rem] font-medium uppercase tracking-widest opacity-40">
                                          {items.length} Services
                                        </span>
                                        <div className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
                                          <ChevronDown className="h-5 w-5 text-[#CBB279]" />
                                        </div>
                                      </div>
                                    </button>

                                    {/* Expanded Service Items */}
                                    <AnimatePresence>
                                      {isExpanded && (
                                        <Motion.div 
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          className="overflow-hidden"
                                        >
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-8 pt-0">
                                            {items.map((service, idx) => (
                                              <div key={service.id || idx} className={`group relative rounded-[1.5rem] border p-5 transition-all hover:shadow-lg ${isLightTheme ? 'bg-black/[0.02] border-black/5 hover:border-[#CBB279]/30' : 'bg-white/[0.02] border-white/5 hover:border-[#CBB279]/20'}`}>
                                                  <h5 className="mb-1 text-base font-medium leading-tight" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                                                    {service.name}
                                                  </h5>
                                                  
                                                  <div className="mb-4 text-lg font-bold text-accent">
                                                    ₹{service.price}
                                                  </div>
                                                  
                                                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                                    <button 
                                                      onClick={() => handleEditService(service)} 
                                                      className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-[#CBB279] hover:text-[#d6b167] transition-colors"
                                                    >
                                                      Edit
                                                    </button>
                                                    <button 
                                                      onClick={() => handleDeleteService(service.id)} 
                                                      className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-red-500/50 hover:text-red-500 transition-colors"
                                                    >
                                                      Delete
                                                    </button>
                                                  </div>
                                              </div>
                                            ))}
                                          </div>
                                        </Motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                );
                              })}
                      </div>
                   </div>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {/* PROMOTION FORM */}
                    <div className={`rounded-3xl border p-8 ${isLightTheme ? 'bg-[#fcfaf7] border-black/5' : 'bg-[#1e1a15]/40 border-white/5'}`}>
                      <h4 className="mb-6 text-sm uppercase tracking-widest text-[#CBB279]">{isEditingPromo ? 'Update Banner' : 'Create New Banner'}</h4>
                      <form onSubmit={handleCreateOrUpdatePromo} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
                        <div className="md:col-span-2">
                          <label className="mb-2 block text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Banner Message</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. 20% OFF ON ALL BRIDAL PACKAGES THIS MONTH!"
                            value={promoForm.text}
                            onChange={(e) => setPromoForm({...promoForm, text: e.target.value})}
                            className={`w-full border-b bg-transparent py-2 text-sm font-light outline-none focus:border-[#CBB279] ${isLightTheme ? 'border-black/10' : 'border-white/10'}`}
                          />
                        </div>
                        <div className="flex items-center gap-4 py-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={promoForm.isActive}
                              onChange={(e) => setPromoForm({...promoForm, isActive: e.target.checked})}
                              className="accent-[#CBB279]"
                            />
                            <span className="text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Active</span>
                          </label>
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-full bg-[#CBB279] px-6 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#d6b167] disabled:opacity-50 flex-1"
                          >
                            {isSaving ? 'Saving...' : (isEditingPromo ? 'Update' : 'Launch')}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* PROMOTIONS LIST */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {promotions.map((p, idx) => (
                        <div key={p.id || idx} className={`rounded-3xl border p-6 flex flex-col justify-between ${isLightTheme ? 'bg-white border-black/5' : 'bg-white/[0.02] border-white/5'}`}>
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <span className={`text-[0.5rem] uppercase tracking-widest px-2 py-1 rounded-full ${p.isActive === true || String(p.isActive).toLowerCase() === 'true' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                                {p.isActive === true || String(p.isActive).toLowerCase() === 'true' ? 'Live' : 'Draft'}
                              </span>
                              <span className="text-[0.5rem] opacity-30 uppercase">{p.timestamp ? new Date(p.timestamp).toLocaleDateString() : ''}</span>
                            </div>
                            <p className="text-sm font-medium mb-2">{p.text}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5">
                            <button 
                              onClick={() => {
                                setIsEditingPromo(true);
                                setCurrentPromoId(p.id);
                                setPromoForm({ text: p.text, link: '', isActive: String(p.isActive).toLowerCase() === 'true', type: p.type || 'classic' });
                              }}
                              className="text-[0.55rem] uppercase tracking-widest text-[#CBB279]"
                            >
                              Edit
                            </button>
                            <button onClick={() => handleDeletePromotion(p.id)} className="text-[0.55rem] uppercase tracking-widest text-red-500/50">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
             </Motion.div>
          </div>
          <p className="mt-12 text-center text-[0.6rem] opacity-20 uppercase tracking-[0.3em]">&copy; Jiya's Studio Management System | Powered by Google Infrastructure</p>
       </div>
    </div>
  );
}
