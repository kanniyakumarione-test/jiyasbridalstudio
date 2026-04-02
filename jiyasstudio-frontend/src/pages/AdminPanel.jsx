import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, LogOut, WandSparkles, X } from 'lucide-react';
import { allServiceSections } from '../data/servicesData';
import { defaultGalleryMediaEntries } from '../data/galleryMedia';
import { defaultHomeFeaturedLookEntries } from '../data/homeFeaturedLooks';
import { buildRemoteGalleryMediaFromEntries, getCategoryFromValue, getGalleryMediaEntryKey } from '../data/galleryMedia.remote';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../components/NotificationProvider';

export default function AdminPanel() {
  const { showToast, confirm } = useNotifications();
  const adminPanelTopRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState('vouchers'); // 'vouchers', 'services', 'promotions', or 'media'
  
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

  // MEDIA STATE
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all');
  const [mediaForm, setMediaForm] = useState({
    type: 'image',
    filename: '',
    title: '',
    description: '',
    sortOrder: '',
    isActive: true,
  });
  const [isEditingMedia, setIsEditingMedia] = useState(false);
  const [currentMediaId, setCurrentMediaId] = useState(null);
  const [mediaUploadFile, setMediaUploadFile] = useState(null);
  const [mediaPreparedUpload, setMediaPreparedUpload] = useState(null);
  const [mediaCompressionStats, setMediaCompressionStats] = useState(null);
  const [isPreparingMedia, setIsPreparingMedia] = useState(false);
  const [mediaUploadStage, setMediaUploadStage] = useState('');
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [expandedMediaItem, setExpandedMediaItem] = useState(null);
  const [homepageFeaturedLooks, setHomepageFeaturedLooks] = useState([]);
  const [featuredLookForm, setFeaturedLookForm] = useState({
    title: '',
    category: '',
    outcome: '',
    mediaFilename: '',
    sortOrder: '',
    isActive: true,
  });
  const [isEditingFeaturedLook, setIsEditingFeaturedLook] = useState(false);
  const [currentFeaturedLookId, setCurrentFeaturedLookId] = useState(null);
  const [draggedFeaturedLookId, setDraggedFeaturedLookId] = useState(null);
  const [draggedMediaId, setDraggedMediaId] = useState(null);

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
  const cloudinaryCloudName = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '').trim();
  const cloudinaryUploadPreset = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '').trim();
  const cloudinaryImageUploadPreset = (import.meta.env.VITE_CLOUDINARY_IMAGE_UPLOAD_PRESET || '').trim();
  const cloudinaryVideoUploadPreset = (import.meta.env.VITE_CLOUDINARY_VIDEO_UPLOAD_PRESET || '').trim();
  const cloudinaryImageFolder = (import.meta.env.VITE_CLOUDINARY_IMAGE_FOLDER || '').trim();
  const cloudinaryVideoFolder = (import.meta.env.VITE_CLOUDINARY_VIDEO_FOLDER || '').trim();

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

  const fetchMediaLibrary = async () => {
    if (!scriptUrl) return;
    try {
      setLoading(true);
      const resp = await fetch(`${scriptUrl}?entity=GalleryMedia&_ts=${Date.now()}`, {
        cache: 'no-store',
      });
      const data = await resp.json();
      if (data.status === 'success') {
        setMediaLibrary(Array.isArray(data.data) ? data.data : []);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch gallery media.');
      }
    } catch (err) {
      setError('Error fetching gallery media.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHomepageFeaturedLooks = async () => {
    if (!scriptUrl) return;
    try {
      setLoading(true);
      const resp = await fetch(`${scriptUrl}?entity=HomepageFeaturedLooks&_ts=${Date.now()}`, {
        cache: 'no-store',
      });
      const data = await resp.json();
      if (data.status === 'success') {
        const rows = Array.isArray(data.data) ? data.data : [];
        setHomepageFeaturedLooks(rows);
        setError(null);
        return rows;
      } else {
        setError(data.message || 'Failed to fetch homepage featured looks.');
      }
    } catch (err) {
      setError('Error fetching homepage featured looks.');
    } finally {
      setLoading(false);
    }
    return [];
  };

  const syncMediaAdminData = async () => {
    await Promise.all([fetchMediaLibrary(), fetchHomepageFeaturedLooks()]);
  };

  const createHomepageFeaturedLookRow = async (entry, sortOrder) => {
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        entity: 'HomepageFeaturedLooks',
        title: entry.title || '',
        category: entry.category || '',
        outcome: entry.outcome || '',
        mediaFilename: entry.mediaFilename || '',
        sortOrder,
        isActive: entry.isActive ?? true,
      }),
    });
  };

  const ensureHomepageFeaturedLooksSeeded = async () => {
    if (!scriptUrl) return [];
    if (homepageFeaturedLooks.length > 0) return homepageFeaturedLooks;

    for (const [index, entry] of defaultHomeFeaturedLookEntries.entries()) {
      await createHomepageFeaturedLookRow(entry, index);
    }

    return await fetchHomepageFeaturedLooks();
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStudents();
      fetchServices();
      fetchPromotions();
      fetchMediaLibrary();
      fetchHomepageFeaturedLooks();
      const interval = setInterval(() => {
        if (activeTab === 'vouchers') fetchStudents();
        else if (activeTab === 'services') fetchServices();
        else if (activeTab === 'promotions') fetchPromotions();
        else {
          fetchMediaLibrary();
          fetchHomepageFeaturedLooks();
        }
      }, 20000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    if (!isAuthenticated) return;
    adminPanelTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeTab, isAuthenticated]);

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

  const resetMediaForm = () => {
    setMediaForm({
      type: 'image',
      filename: '',
      title: '',
      description: '',
      sortOrder: '',
      isActive: true,
    });
    setIsEditingMedia(false);
    setCurrentMediaId(null);
    setMediaUploadFile(null);
    setMediaPreparedUpload(null);
    setMediaCompressionStats(null);
    setIsPreparingMedia(false);
    setMediaUploadStage('');
  };

  const resetFeaturedLookForm = () => {
    setFeaturedLookForm({
      title: '',
      category: '',
      outcome: '',
      mediaFilename: '',
      sortOrder: '',
      isActive: true,
    });
    setIsEditingFeaturedLook(false);
    setCurrentFeaturedLookId(null);
  };

  const handleEditFeaturedLook = async (item) => {
    let nextItem = item;

    if (!homepageFeaturedLooks.length) {
      const seededRows = await ensureHomepageFeaturedLooksSeeded();
      nextItem =
        seededRows.find(
          (row) =>
            String(row.title || '').trim() === String(item.title || '').trim() &&
            String(row.category || '').trim() === String(item.category || '').trim() &&
            String(row.mediaFilename || row.MediaFilename || '').trim() === String(item.mediaFilename || '').trim()
        ) || item;
    }

    setIsEditingFeaturedLook(true);
    setCurrentFeaturedLookId(nextItem.id);
    setFeaturedLookForm({
      title: nextItem.title || '',
      category: nextItem.category || '',
      outcome: nextItem.outcome || nextItem.Outcome || nextItem.description || '',
      mediaFilename: nextItem.mediaFilename || nextItem.MediaFilename || nextItem.filename || '',
      sortOrder: nextItem.sortOrder || nextItem.SortOrder || '',
      isActive: !String(nextItem.isActive ?? nextItem.IsActive ?? 'true')
        .trim()
        .match(/^(false|0|no)$/i),
    });
    adminPanelTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCreateOrUpdateFeaturedLook = async (e) => {
    e.preventDefault();
    if (!scriptUrl) return;

    try {
      setIsSaving(true);
      let effectiveIsEditing = isEditingFeaturedLook;
      let effectiveId = currentFeaturedLookId;

      if (!homepageFeaturedLooks.length) {
        const seededRows = await ensureHomepageFeaturedLooksSeeded();
        const matchedRow = seededRows.find(
          (row) =>
            String(row.title || '').trim() === String(featuredLookForm.title || '').trim() &&
            String(row.category || '').trim() === String(featuredLookForm.category || '').trim() &&
            String(row.mediaFilename || row.MediaFilename || '').trim() === String(featuredLookForm.mediaFilename || '').trim()
        );

        if (matchedRow) {
          effectiveIsEditing = true;
          effectiveId = matchedRow.id;
        }
      }

      const normalizedEntry = {
        id: effectiveId || `temp-home-look-${Date.now()}`,
        title: featuredLookForm.title.trim(),
        category: featuredLookForm.category.trim(),
        outcome: featuredLookForm.outcome.trim(),
        mediaFilename: featuredLookForm.mediaFilename.trim(),
        sortOrder: featuredLookForm.sortOrder === '' ? 0 : Number(featuredLookForm.sortOrder),
        isActive: featuredLookForm.isActive,
      };

      const payload = {
        action: effectiveIsEditing ? 'update' : 'create',
        entity: 'HomepageFeaturedLooks',
        title: normalizedEntry.title,
        category: normalizedEntry.category,
        outcome: normalizedEntry.outcome,
        mediaFilename: normalizedEntry.mediaFilename,
        sortOrder: normalizedEntry.sortOrder,
        isActive: normalizedEntry.isActive,
      };

      if (effectiveIsEditing) payload.id = effectiveId;

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      resetFeaturedLookForm();
      await syncMediaAdminData();
      showToast(effectiveIsEditing ? 'Homepage featured look updated.' : 'Homepage featured look added.', {
        tone: 'success',
        title: 'Saved',
      });
    } catch (err) {
      setError('Failed to save homepage featured look.');
      showToast('Failed to save homepage featured look.', { tone: 'error', title: 'Save Failed' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFeaturedLook = async (id) => {
    const approved = await confirm({
      title: 'Delete homepage featured look?',
      message: 'This card will be removed from the homepage featured looks section.',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep',
      tone: 'danger',
    });
    if (!approved || !scriptUrl) return;

    try {
      if (!homepageFeaturedLooks.length) {
        await ensureHomepageFeaturedLooksSeeded();
      }
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id, entity: 'HomepageFeaturedLooks' }),
      });
      await syncMediaAdminData();
      showToast('Homepage featured look deleted.', { tone: 'success', title: 'Deleted' });
    } catch (err) {
      setError('Failed to delete homepage featured look.');
      showToast('Failed to delete homepage featured look.', { tone: 'error', title: 'Delete Failed' });
    }
  };

  const persistFeaturedLookOrder = async (orderedItems, previousLooks) => {
    if (!scriptUrl) return;

    try {
      await Promise.all(
        orderedItems.map((item, index) =>
          fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'update',
              entity: 'HomepageFeaturedLooks',
              id: item.id,
              title: item.title,
              category: item.category,
              outcome: item.outcome,
              mediaFilename: item.mediaFilename,
              sortOrder: index,
              isActive: item.isActive,
            }),
          })
        )
      );
      await syncMediaAdminData();
      showToast('Homepage featured look order updated.', { tone: 'success', title: 'Reordered' });
    } catch (err) {
      setHomepageFeaturedLooks(previousLooks);
      setError('Failed to update homepage featured look order.');
      showToast('Failed to update homepage featured look order.', { tone: 'error', title: 'Reorder Failed' });
    }
  };

  const handleReorderFeaturedLooks = async (fromId, toId) => {
    if (!scriptUrl || !fromId || !toId || String(fromId) === String(toId)) return;

    const fallbackOrderedItems = [...activeHomeFeaturedLooks];
    const fallbackFromItem = fallbackOrderedItems.find((item) => String(item.id) === String(fromId));
    const fallbackToItem = fallbackOrderedItems.find((item) => String(item.id) === String(toId));
    const liveRows = homepageFeaturedLooks.length > 0 ? homepageFeaturedLooks : await ensureHomepageFeaturedLooksSeeded();

    const orderedItems = [...liveRows]
      .map((item, index) => ({
        ...item,
        id: item.id || item.ID || item.Id || `home-look-${index + 1}`,
        title: item.title || item.Title || '',
        category: item.category || item.Category || '',
        outcome: item.outcome || item.Outcome || item.description || item.Description || '',
        mediaFilename: item.mediaFilename || item.MediaFilename || item.filename || '',
        sortOrder: Number.isFinite(Number(item.sortOrder || item.SortOrder)) ? Number(item.sortOrder || item.SortOrder) : index,
        isActive: !String(item.isActive ?? item.IsActive ?? 'true')
          .trim()
          .match(/^(false|0|no)$/i),
      }))
      .sort((left, right) => left.sortOrder - right.sortOrder || left.title.localeCompare(right.title));

    const resolvedFromId =
      fallbackFromItem && !homepageFeaturedLooks.length
        ? orderedItems.find(
            (item) =>
              item.title === fallbackFromItem.title &&
              item.category === fallbackFromItem.category &&
              item.mediaFilename === fallbackFromItem.mediaFilename
          )?.id || fromId
        : fromId;
    const resolvedToId =
      fallbackToItem && !homepageFeaturedLooks.length
        ? orderedItems.find(
            (item) =>
              item.title === fallbackToItem.title &&
              item.category === fallbackToItem.category &&
              item.mediaFilename === fallbackToItem.mediaFilename
          )?.id || toId
        : toId;

    const previousLooks = homepageFeaturedLooks.length > 0 ? homepageFeaturedLooks : orderedItems;
    const fromIndex = orderedItems.findIndex((item) => String(item.id) === String(resolvedFromId));
    const toIndex = orderedItems.findIndex((item) => String(item.id) === String(resolvedToId));
    if (fromIndex < 0 || toIndex < 0) return;

    const [movedItem] = orderedItems.splice(fromIndex, 1);
    orderedItems.splice(toIndex, 0, movedItem);

    const reorderedState = orderedItems.map((item, index) => ({
      ...item,
      sortOrder: index,
    }));

    setHomepageFeaturedLooks(reorderedState);
    await persistFeaturedLookOrder(reorderedState, previousLooks);
  };

  const handleShiftFeaturedLookOrder = async (id, direction) => {
    const orderedItems = [...activeHomeFeaturedLooks];
    const currentIndex = orderedItems.findIndex((item) => String(item.id) === String(id));
    if (currentIndex < 0) return;

    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= orderedItems.length) return;

    await handleReorderFeaturedLooks(id, orderedItems[targetIndex].id);
  };

  const formatBytes = (bytes) => {
    const numeric = Number(bytes || 0);
    if (!numeric) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB'];
    const exponent = Math.min(Math.floor(Math.log(numeric) / Math.log(1024)), units.length - 1);
    const value = numeric / 1024 ** exponent;
    return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
  };

  const compressImageForUpload = async (file) => {
    const bitmap = await createImageBitmap(file);
    const maxDimension = 1800;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const targetWidth = Math.max(1, Math.round(bitmap.width * scale));
    const targetHeight = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext('2d', { alpha: false });
    context.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
    bitmap.close();

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (nextBlob) => {
          if (nextBlob) resolve(nextBlob);
          else reject(new Error('Unable to compress image for upload.'));
        },
        'image/jpeg',
        0.72
      );
    });

    return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.jpg`, {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  };

  const waitForLoadedMetadata = (video) =>
    new Promise((resolve, reject) => {
      const handleLoaded = () => resolve();
      const handleError = () => reject(new Error('Unable to read video file for compression.'));
      video.addEventListener('loadedmetadata', handleLoaded, { once: true });
      video.addEventListener('error', handleError, { once: true });
    });

  const waitForCanPlay = (video) =>
    new Promise((resolve, reject) => {
      const handleCanPlay = () => resolve();
      const handleError = () => reject(new Error('Video cannot be played for compression.'));
      video.addEventListener('canplay', handleCanPlay, { once: true });
      video.addEventListener('error', handleError, { once: true });
    });

  const waitForVideoEnd = (video) =>
    new Promise((resolve) => {
      video.addEventListener('ended', () => resolve(), { once: true });
    });

  const compressVideoForUpload = async (file) => {
    if (typeof MediaRecorder === 'undefined') {
      return file;
    }

    const sourceUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = sourceUrl;
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    try {
      await waitForLoadedMetadata(video);
      await waitForCanPlay(video);

      const maxDimension = 1280;
      const scale = Math.min(1, maxDimension / Math.max(video.videoWidth || 1, video.videoHeight || 1));
      const targetWidth = Math.max(2, Math.round((video.videoWidth || 1280) * scale / 2) * 2);
      const targetHeight = Math.max(2, Math.round((video.videoHeight || 720) * scale / 2) * 2);

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const context = canvas.getContext('2d', { alpha: false });

      const stream = canvas.captureStream(24);
      const sourceStream = typeof video.captureStream === 'function' ? video.captureStream() : null;
      const audioTracks = sourceStream ? sourceStream.getAudioTracks() : [];
      audioTracks.forEach((track) => stream.addTrack(track));

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
          ? 'video/webm;codecs=vp8,opus'
          : MediaRecorder.isTypeSupported('video/webm')
            ? 'video/webm'
            : '';

      if (!mimeType) {
        return file;
      }

      const recordedChunks = [];
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 1_500_000,
        audioBitsPerSecond: audioTracks.length ? 96_000 : undefined,
      });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      const renderFrame = () => {
        if (video.paused || video.ended) return;
        context.drawImage(video, 0, 0, targetWidth, targetHeight);
        requestAnimationFrame(renderFrame);
      };

      const stopPromise = new Promise((resolve) => {
        recorder.onstop = () => resolve();
      });

      recorder.start(1000);
      await video.play();
      renderFrame();
      await waitForVideoEnd(video);
      recorder.stop();
      await stopPromise;

      const blob = new Blob(recordedChunks, { type: mimeType });

      if (!blob.size || blob.size >= file.size) {
        return file;
      }

      return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webm`, {
        type: mimeType.split(';')[0],
        lastModified: Date.now(),
      });
    } catch (error) {
      console.warn('Video compression failed, falling back to original upload.', error);
      return file;
    } finally {
      URL.revokeObjectURL(sourceUrl);
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
  };

  const prepareMediaUpload = async (file, type) => {
    setIsPreparingMedia(true);
    setMediaUploadStage(type === 'video' ? 'Compressing video...' : 'Compressing image...');

    try {
      const preparedFile =
        type === 'image' ? await compressImageForUpload(file) : await compressVideoForUpload(file);
      const originalBytes = file.size || 0;
      const compressedBytes = preparedFile.size || originalBytes;
      const bytesSaved = Math.max(0, originalBytes - compressedBytes);
      const compressionPercent = originalBytes > 0 ? Math.max(0, (bytesSaved / originalBytes) * 100) : 0;

      setMediaPreparedUpload(preparedFile);
      setMediaCompressionStats({
        originalBytes,
        compressedBytes,
        compressionPercent,
        changedExtension: preparedFile.name !== file.name,
      });
      setMediaUploadStage('Ready to upload');
      return preparedFile;
    } catch (error) {
      setMediaPreparedUpload(file);
      setMediaCompressionStats({
        originalBytes: file.size || 0,
        compressedBytes: file.size || 0,
        compressionPercent: 0,
        changedExtension: false,
      });
      setMediaUploadStage('Ready to upload');
      throw error;
    } finally {
      setIsPreparingMedia(false);
    }
  };

  const uploadMediaToCloudinary = async (file, type, preparedFileOverride) => {
    const uploadPreset =
      type === 'video'
        ? cloudinaryVideoUploadPreset || cloudinaryUploadPreset
        : cloudinaryImageUploadPreset || cloudinaryUploadPreset;

    if (!cloudinaryCloudName || !uploadPreset) {
      throw new Error(
        type === 'video'
          ? 'Cloudinary video upload preset is not configured.'
          : 'Cloudinary image upload preset is not configured.'
      );
    }

    const preparedFile = preparedFileOverride || file;
    const baseName = file.name.replace(/\.[^.]+$/, '');
    const folder = type === 'video' ? cloudinaryVideoFolder : cloudinaryImageFolder;
    const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudinaryCloudName)}/${type}/upload`;
    const formData = new FormData();
    formData.append('file', preparedFile);
    formData.append('upload_preset', uploadPreset);
    formData.append('public_id', folder ? `${folder}/${baseName}` : baseName);
    formData.append('overwrite', 'true');
    formData.append('resource_type', type);

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload?.error?.message || 'Cloudinary upload failed.');
    }

    return {
      filename: file.name,
      url: payload.secure_url,
      publicId: payload.public_id,
      bytes: payload.bytes,
      width: payload.width || '',
      height: payload.height || '',
      duration: payload.duration || '',
      format: payload.format || '',
      uploadedAt: payload.created_at || new Date().toISOString(),
    };
  };

  const handleCreateOrUpdateMedia = async (e) => {
    e.preventDefault();
    if (!scriptUrl) return;

    try {
      setIsSaving(true);
      const currentMediaRecord = mediaLibrary.find((item) => String(item.id) === String(currentMediaId));
      let uploadMeta = null;
      const derivedTitle = mediaForm.title || mediaUploadFile?.name?.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ') || '';
      const derivedFilename = (mediaUploadFile?.name || uploadMeta?.filename || mediaForm.filename).trim();
      const derivedCategory = getCategoryFromValue(derivedFilename || derivedTitle || mediaForm.type);

      if (mediaUploadFile) {
        setIsUploadingMedia(true);
        setMediaUploadStage('Uploading to Cloudinary...');
        uploadMeta = await uploadMediaToCloudinary(mediaUploadFile, mediaForm.type, mediaPreparedUpload || mediaUploadFile);
        setMediaForm((current) => ({
          ...current,
          filename: uploadMeta.filename,
          title: current.title || derivedTitle,
        }));
      }

      const payload = {
        action: isEditingMedia ? 'update' : 'create',
        entity: 'GalleryMedia',
        type: mediaForm.type,
        filename: (uploadMeta?.filename || mediaForm.filename).trim(),
        title: derivedTitle.trim(),
        category: derivedCategory,
        description: mediaForm.description.trim(),
        sortOrder: mediaForm.sortOrder === '' ? '' : Number(mediaForm.sortOrder),
        isActive: mediaForm.isActive,
        url: uploadMeta?.url || currentMediaRecord?.url || currentMediaRecord?.URL || '',
        publicId: uploadMeta?.publicId || currentMediaRecord?.publicId || currentMediaRecord?.PublicId || '',
        bytes: uploadMeta?.bytes || currentMediaRecord?.bytes || currentMediaRecord?.Bytes || '',
        width: uploadMeta?.width || currentMediaRecord?.width || currentMediaRecord?.Width || '',
        height: uploadMeta?.height || currentMediaRecord?.height || currentMediaRecord?.Height || '',
        duration: uploadMeta?.duration || currentMediaRecord?.duration || currentMediaRecord?.Duration || '',
        format: uploadMeta?.format || currentMediaRecord?.format || currentMediaRecord?.Format || '',
        uploadedAt: uploadMeta?.uploadedAt || currentMediaRecord?.uploadedAt || currentMediaRecord?.UploadedAt || '',
      };

      if (isEditingMedia) payload.id = currentMediaId;

      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      resetMediaForm();
      await fetchMediaLibrary();
      showToast(
        mediaUploadFile
          ? 'Cloudinary upload finished and the gallery row was saved.'
          : isEditingMedia
            ? 'Gallery media updated successfully.'
            : 'Gallery media added successfully.',
        {
          tone: 'success',
          title: 'Saved',
        }
      );
    } catch (err) {
      setError(err.message || 'Failed to save gallery media.');
      showToast(err.message || 'Failed to save gallery media.', { tone: 'error', title: 'Save Failed' });
    } finally {
      setIsUploadingMedia(false);
      setMediaUploadStage('');
      setIsSaving(false);
    }
  };

  const handleEditMedia = (item) => {
    setIsEditingMedia(true);
    setCurrentMediaId(item.id);
    setMediaUploadFile(null);
    setMediaPreparedUpload(null);
    setMediaCompressionStats(null);
    setMediaUploadStage('');
    setMediaForm({
      type: String(item.type || 'image').toLowerCase() === 'video' ? 'video' : 'image',
      filename: item.filename || item.fileName || '',
      title: item.title || '',
      description: item.description || '',
      sortOrder: item.sortOrder || item.SortOrder || '',
      isActive: !String(item.isActive ?? item.IsActive ?? 'true')
        .trim()
        .match(/^(false|0|no)$/i),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteMedia = async (id) => {
    const approved = await confirm({
      title: 'Delete gallery media?',
      message: 'This entry will be removed from the live gallery catalog.',
      confirmLabel: 'Delete',
      cancelLabel: 'Keep',
      tone: 'danger',
    });
    if (!approved || !scriptUrl) return;

    try {
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id, entity: 'GalleryMedia' }),
      });
      await fetchMediaLibrary();
      showToast('Gallery media deleted.', { tone: 'success', title: 'Deleted' });
    } catch (err) {
      setError('Failed to delete gallery media.');
      showToast('Failed to delete gallery media.', { tone: 'error', title: 'Delete Failed' });
    }
  };

  const buildGalleryMediaUpdatePayload = (record, overrides = {}) => {
    const filename = overrides.filename ?? record.filename ?? record.fileName ?? '';
    const title = overrides.title ?? record.title ?? record.Title ?? '';

    return {
      action: 'update',
      entity: 'GalleryMedia',
      id: record.id,
      type: overrides.type ?? (String(record.type || record.Type || 'image').toLowerCase() === 'video' ? 'video' : 'image'),
      filename,
      title,
      category: overrides.category ?? record.category ?? record.Category ?? getCategoryFromValue(filename || title || 'image'),
      description: overrides.description ?? record.description ?? record.Description ?? '',
      sortOrder: overrides.sortOrder ?? record.sortOrder ?? record.SortOrder ?? 0,
      isActive:
        overrides.isActive ??
        !String(record.isActive ?? record.IsActive ?? 'true')
          .trim()
          .match(/^(false|0|no)$/i),
      url: overrides.url ?? record.url ?? record.URL ?? '',
      publicId: overrides.publicId ?? record.publicId ?? record.PublicId ?? '',
      bytes: overrides.bytes ?? record.bytes ?? record.Bytes ?? '',
      width: overrides.width ?? record.width ?? record.Width ?? '',
      height: overrides.height ?? record.height ?? record.Height ?? '',
      duration: overrides.duration ?? record.duration ?? record.Duration ?? '',
      format: overrides.format ?? record.format ?? record.Format ?? '',
      uploadedAt: overrides.uploadedAt ?? record.uploadedAt ?? record.UploadedAt ?? '',
    };
  };

  const handleShiftMediaOrder = async (id, direction) => {
    if (!scriptUrl) return;

    const orderedItems = [...mediaLibrary].sort(
      (left, right) =>
        Number(left.sortOrder ?? left.SortOrder ?? 0) - Number(right.sortOrder ?? right.SortOrder ?? 0) ||
        String(left.title || left.Title || '').localeCompare(String(right.title || right.Title || ''))
    );

    const currentIndex = orderedItems.findIndex((item) => String(item.id) === String(id));
    if (currentIndex < 0) return;

    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= orderedItems.length) return;

    const currentItem = orderedItems[currentIndex];
    const targetItem = orderedItems[targetIndex];
    const currentSortOrder = Number(currentItem.sortOrder ?? currentItem.SortOrder ?? currentIndex);
    const targetSortOrder = Number(targetItem.sortOrder ?? targetItem.SortOrder ?? targetIndex);
    const previousMediaLibrary = mediaLibrary;

    setMediaLibrary((currentLibrary) =>
      currentLibrary.map((item) => {
        if (String(item.id) === String(currentItem.id)) {
          return { ...item, sortOrder: targetSortOrder };
        }
        if (String(item.id) === String(targetItem.id)) {
          return { ...item, sortOrder: currentSortOrder };
        }
        return item;
      })
    );

    try {
      await Promise.all([
        fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildGalleryMediaUpdatePayload(currentItem, { sortOrder: targetSortOrder })),
        }),
        fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildGalleryMediaUpdatePayload(targetItem, { sortOrder: currentSortOrder })),
        }),
      ]);
      fetchMediaLibrary();
    } catch (err) {
      setMediaLibrary(previousMediaLibrary);
      setError('Failed to update gallery order.');
      showToast('Failed to update gallery order.', { tone: 'error', title: 'Reorder Failed' });
    }
  };

  const persistGalleryMediaOrder = async (orderedItems, previousMediaLibrary) => {
    try {
      await Promise.all(
        orderedItems.map((item, index) =>
          fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(buildGalleryMediaUpdatePayload(item, { sortOrder: index })),
          })
        )
      );
      await syncMediaAdminData();
      showToast('Gallery order updated.', { tone: 'success', title: 'Reordered' });
    } catch (err) {
      setMediaLibrary(previousMediaLibrary);
      setError('Failed to update gallery order.');
      showToast('Failed to update gallery order.', { tone: 'error', title: 'Reorder Failed' });
    }
  };

  const handleReorderMedia = async (fromId, toId) => {
    if (!scriptUrl || !fromId || !toId || String(fromId) === String(toId)) return;

    const orderedItems = [...mediaLibrary].sort(
      (left, right) =>
        Number(left.sortOrder ?? left.SortOrder ?? 0) - Number(right.sortOrder ?? right.SortOrder ?? 0) ||
        String(left.title || left.Title || '').localeCompare(String(right.title || right.Title || ''))
    );
    const fromIndex = orderedItems.findIndex((item) => String(item.id) === String(fromId));
    const toIndex = orderedItems.findIndex((item) => String(item.id) === String(toId));
    if (fromIndex < 0 || toIndex < 0) return;

    const previousMediaLibrary = mediaLibrary;
    const [movedItem] = orderedItems.splice(fromIndex, 1);
    orderedItems.splice(toIndex, 0, movedItem);

    const reorderedState = orderedItems.map((item, index) => ({
      ...item,
      sortOrder: index,
    }));

    setMediaLibrary(reorderedState);
    await persistGalleryMediaOrder(reorderedState, previousMediaLibrary);
  };

  const importMediaCatalog = async () => {
    if (!scriptUrl) return;
    const approved = await confirm({
      title: 'Import current Cloudinary gallery?',
      message: 'This will copy the current live photo and video filenames into the admin-managed gallery sheet.',
      confirmLabel: 'Import',
      cancelLabel: 'Cancel',
    });
    if (!approved) return;

    try {
      setIsSaving(true);
      const existingMediaKeys = new Set(mediaLibrary.map((item) => getGalleryMediaEntryKey(item)).filter(Boolean));
      let importedCount = 0;

      for (const item of defaultGalleryMediaEntries) {
        const itemKey = getGalleryMediaEntryKey(item);
        if (!itemKey || existingMediaKeys.has(itemKey)) continue;

        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create',
            entity: 'GalleryMedia',
            type: item.type,
            filename: item.filename,
            title: item.title,
            category: item.category,
            description: item.description,
            sortOrder: item.sortOrder,
            isActive: true,
          }),
        });

        existingMediaKeys.add(itemKey);
        importedCount += 1;
      }

      await fetchMediaLibrary();
      showToast(
        importedCount > 0
          ? `Cloudinary gallery catalog imported. Added ${importedCount} new item${importedCount === 1 ? '' : 's'}.`
          : 'Cloudinary gallery catalog is already imported. No duplicates were added.',
        { tone: 'success', title: 'Import Finished' }
      );
    } catch (err) {
      setError('Failed to import gallery media.');
      showToast('Failed to import gallery media.', { tone: 'error', title: 'Import Failed' });
    } finally {
      setIsSaving(false);
    }
  };

  const liveMediaPreview = useMemo(() => buildRemoteGalleryMediaFromEntries(mediaLibrary).mediaItems, [mediaLibrary]);
  const fallbackMediaPreview = useMemo(
    () => buildRemoteGalleryMediaFromEntries(defaultGalleryMediaEntries).mediaItems,
    []
  );
  const activeMediaPreview = liveMediaPreview.length > 0 ? liveMediaPreview : fallbackMediaPreview;
  const activeMediaPreviewByFilename = useMemo(
    () =>
      new Map(
        activeMediaPreview
          .filter((item) => item.filename)
          .map((item) => [String(item.filename).trim().toLowerCase(), item])
      ),
    [activeMediaPreview]
  );
  const activeHomeFeaturedLooks = useMemo(() => {
    const source = homepageFeaturedLooks.length > 0 ? homepageFeaturedLooks : defaultHomeFeaturedLookEntries;
    const normalizedItems = source
      .map((item, index) => {
        const mediaFilename = item.mediaFilename || item.MediaFilename || item.filename || '';
        const previewMatch = activeMediaPreviewByFilename.get(String(mediaFilename).trim().toLowerCase());
        return {
          ...item,
          id: item.id || item.ID || item.Id || `home-look-${index + 1}`,
          title: item.title || item.Title || '',
          category: item.category || item.Category || '',
          outcome: item.outcome || item.Outcome || item.description || item.Description || '',
          mediaFilename,
          sortOrder: Number.isFinite(Number(item.sortOrder || item.SortOrder)) ? Number(item.sortOrder || item.SortOrder) : index,
          isActive: !String(item.isActive ?? item.IsActive ?? 'true')
            .trim()
            .match(/^(false|0|no)$/i),
          previewItem: previewMatch || null,
        };
      })
      .sort((left, right) => left.sortOrder - right.sortOrder || left.title.localeCompare(right.title));

    const dedupedItems = [];
    const seenFeaturedLookKeys = new Set();

    normalizedItems.forEach((item) => {
      const dedupeKey = [
        String(item.title || '').trim().toLowerCase(),
        String(item.category || '').trim().toLowerCase(),
        String(item.mediaFilename || '').trim().toLowerCase(),
      ].join('::');

      if (seenFeaturedLookKeys.has(dedupeKey)) return;
      seenFeaturedLookKeys.add(dedupeKey);
      dedupedItems.push(item);
    });

    return dedupedItems.slice(0, 4);
  }, [activeMediaPreviewByFilename, homepageFeaturedLooks]);
  const featuredLookPreviewItem = useMemo(
    () => activeMediaPreviewByFilename.get(String(featuredLookForm.mediaFilename || '').trim().toLowerCase()) || null,
    [activeMediaPreviewByFilename, featuredLookForm.mediaFilename]
  );
  const featuredLookPreviewCard = useMemo(
    () => ({
      title: featuredLookForm.title.trim() || 'Preview Title',
      category: featuredLookForm.category.trim() || 'Preview Tag',
      outcome:
        featuredLookForm.outcome.trim() ||
        'Choose a gallery image and update the text to preview the homepage featured look card live.',
      previewItem: featuredLookPreviewItem,
      sortOrder: featuredLookForm.sortOrder === '' ? 'Auto' : featuredLookForm.sortOrder,
    }),
    [featuredLookForm.category, featuredLookForm.mediaFilename, featuredLookForm.outcome, featuredLookForm.sortOrder, featuredLookForm.title, featuredLookPreviewItem]
  );
  const filteredMediaPreview = activeMediaPreview.filter((item) => {
    const matchesType = mediaTypeFilter === 'all' || item.type === mediaTypeFilter;
    const matchesSearch = [item.title, item.filename, item.category, item.description]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(mediaSearch.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const renderAdminMediaCardVisual = (item) => {
    if (item.type !== 'video') {
      return <img src={item.previewSrc || item.src} alt={item.title} className="h-full w-full object-cover" />;
    }

    const previewSrc = item.previewSrc || item.posterSrc;
    if (previewSrc) {
      return <img src={previewSrc} alt={item.title} className="h-full w-full object-cover" />;
    }

    return (
      <div className="flex h-full w-full items-end bg-[radial-gradient(circle_at_top,#7a5c2f_0%,#23180f_45%,#090909_100%)] p-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.24em] text-white/75">
            Video Preview
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-white/95" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            {item.title}
          </p>
        </div>
      </div>
    );
  };

  const adminSelectClassName = `w-full appearance-none rounded-[1.05rem] border px-4 py-3 pr-11 text-sm uppercase tracking-[0.18em] outline-none transition-all focus:border-[#CBB279] ${
    isLightTheme
      ? 'border-black/10 bg-white text-[#21180f]'
      : 'border-white/10 bg-[#120f0c] text-white'
  }`;

  const adminSelectOptionClassName = isLightTheme ? 'bg-white text-[#21180f]' : 'bg-[#120f0c] text-white';

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
               ref={adminPanelTopRef}
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
                  <button 
                    onClick={() => setActiveTab('media')}
                    className={`pb-4 text-xs uppercase tracking-[0.3em] transition-all ${activeTab === 'media' ? 'text-[#CBB279] border-b-2 border-[#CBB279]' : 'text-[#baa98e] opacity-50'}`}
                  >
                    Gallery Media
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
                ) : activeTab === 'promotions' ? (
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
                ) : (
                  <div className="space-y-12">
                    <div className={`rounded-3xl border p-8 ${isLightTheme ? 'bg-[#fcfaf7] border-black/5' : 'bg-[#1e1a15]/40 border-white/5'}`}>
                      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h4 className="text-sm uppercase tracking-widest text-[#CBB279]">
                            {isEditingMedia ? 'Update Gallery Media' : 'Add Cloudinary Media'}
                          </h4>
                          <p className={`mt-3 max-w-3xl text-sm leading-7 ${isLightTheme ? 'text-[#5f4a34]' : 'text-[#d6c9b4]'}`}>
                            Add the Cloudinary filename that already exists inside your configured image or video folders. This controls what shows on the live gallery page.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={importMediaCatalog}
                          disabled={isSaving}
                          className="rounded-full border border-[#CBB279]/30 px-5 py-3 text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[#CBB279] transition-all hover:bg-[#CBB279]/10 disabled:opacity-40"
                        >
                          Import Current Gallery
                        </button>
                      </div>

                      <form onSubmit={handleCreateOrUpdateMedia} className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                        <div>
                          <label className="mb-2 block text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Media Type</label>
                          <div className="relative">
                            <select
                              value={mediaForm.type}
                              onChange={(e) => {
                                setMediaUploadFile(null);
                                setMediaPreparedUpload(null);
                                setMediaCompressionStats(null);
                                setMediaUploadStage('');
                                setMediaForm({ ...mediaForm, type: e.target.value });
                              }}
                              className={adminSelectClassName}
                            >
                              <option className={adminSelectOptionClassName} value="image">Photo</option>
                              <option className={adminSelectOptionClassName} value="video">Video</option>
                            </select>
                            <ChevronDown className={`pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 ${isLightTheme ? 'text-[#8c6a2d]' : 'text-[#CBB279]'}`} />
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 block text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Filename</label>
                          <input
                            required={!mediaUploadFile}
                            type="text"
                            placeholder={mediaUploadFile ? mediaUploadFile.name : mediaForm.type === 'video' ? 'example-reel.mp4' : 'example-look.jpg'}
                            value={mediaForm.filename}
                            onChange={(e) => setMediaForm({ ...mediaForm, filename: e.target.value })}
                            className={`w-full border-b bg-transparent py-2 text-sm font-light outline-none focus:border-[#CBB279] ${isLightTheme ? 'border-black/10' : 'border-white/10'}`}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Title</label>
                          <input
                            type="text"
                            placeholder="Bridal Reception Glow"
                            value={mediaForm.title}
                            onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                            className={`w-full border-b bg-transparent py-2 text-sm font-light outline-none focus:border-[#CBB279] ${isLightTheme ? 'border-black/10' : 'border-white/10'}`}
                          />
                        </div>
                        <div className="md:col-span-2 xl:col-span-2">
                          <label className="mb-2 block text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Description</label>
                          <input
                            type="text"
                            placeholder="Short premium caption for the gallery card."
                            value={mediaForm.description}
                            onChange={(e) => setMediaForm({ ...mediaForm, description: e.target.value })}
                            className={`w-full border-b bg-transparent py-2 text-sm font-light outline-none focus:border-[#CBB279] ${isLightTheme ? 'border-black/10' : 'border-white/10'}`}
                          />
                        </div>
                        <div className="md:col-span-2 xl:col-span-2">
                          <label className="mb-2 block text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Upload File</label>
                          <input
                            type="file"
                            accept={mediaForm.type === 'video' ? 'video/*' : 'image/*'}
                            onChange={async (e) => {
                              const nextFile = e.target.files?.[0] || null;
                              setMediaUploadFile(nextFile);
                              setMediaPreparedUpload(null);
                              setMediaCompressionStats(null);
                              setMediaUploadStage('');

                              if (!nextFile) return;

                              setMediaForm((current) => ({
                                ...current,
                                filename: nextFile.name,
                                title: current.title || nextFile.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '),
                              }));

                              try {
                                await prepareMediaUpload(nextFile, mediaForm.type);
                              } catch (error) {
                                showToast('Compression failed, so the original file will be used for upload.', {
                                  tone: 'info',
                                  title: 'Using Original File',
                                });
                              }
                            }}
                            className={`w-full rounded-2xl border px-4 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-[#CBB279] file:px-4 file:py-2 file:text-[0.62rem] file:font-bold file:uppercase file:tracking-[0.2em] file:text-black ${isLightTheme ? 'border-black/10 bg-black/[0.02]' : 'border-white/10 bg-white/[0.02]'}`}
                          />
                          <p className={`mt-3 text-xs leading-6 ${isLightTheme ? 'text-[#6b5540]' : 'text-[#d6c9b4]'}`}>
                            Photos and videos are compressed in the browser first, then uploaded to Cloudinary for optimized delivery on the website.
                          </p>
                          {(isPreparingMedia || isUploadingMedia || mediaUploadStage) && (
                            <div className={`mt-4 flex items-center gap-3 rounded-2xl border px-4 py-3 text-xs ${isLightTheme ? 'border-black/8 bg-black/[0.02] text-[#5f4a34]' : 'border-white/8 bg-white/[0.03] text-[#d6c9b4]'}`}>
                              <span className={`h-4 w-4 rounded-full border-2 border-[#CBB279]/30 ${isPreparingMedia || isUploadingMedia ? 'animate-spin border-t-[#CBB279]' : 'border-[#CBB279] bg-[#CBB279]/15'}`} />
                              <span>{mediaUploadStage || (isPreparingMedia ? 'Preparing media...' : 'Uploading...')}</span>
                            </div>
                          )}
                          {mediaCompressionStats && (
                            <div className={`mt-4 grid gap-3 rounded-[1.4rem] border p-4 text-xs sm:grid-cols-3 ${isLightTheme ? 'border-black/8 bg-black/[0.02] text-[#5f4a34]' : 'border-white/8 bg-white/[0.03] text-[#d6c9b4]'}`}>
                              <div>
                                <div className="mb-1 uppercase tracking-[0.22em] text-[#CBB279]">Original Size</div>
                                <div>{formatBytes(mediaCompressionStats.originalBytes)}</div>
                              </div>
                              <div>
                                <div className="mb-1 uppercase tracking-[0.22em] text-[#CBB279]">Compressed Size</div>
                                <div>{formatBytes(mediaCompressionStats.compressedBytes)}</div>
                              </div>
                              <div>
                                <div className="mb-1 uppercase tracking-[0.22em] text-[#CBB279]">Compression</div>
                                <div>{mediaCompressionStats.compressionPercent.toFixed(1)}%</div>
                              </div>
                              {mediaCompressionStats.changedExtension && (
                                <div className="sm:col-span-3 text-[0.72rem] opacity-80">
                                  The prepared upload format changed to improve delivery efficiency.
                                </div>
                              )}
                            </div>
                          )}
                          {!((mediaForm.type === 'video' ? cloudinaryVideoUploadPreset : cloudinaryImageUploadPreset) || cloudinaryUploadPreset) && (
                            <p className="mt-2 text-xs leading-6 text-red-500">
                              Add the matching Cloudinary upload preset in `.env` to enable direct uploads from the admin panel.
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="mb-2 block text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Sort Order</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={mediaForm.sortOrder}
                            onChange={(e) => setMediaForm({ ...mediaForm, sortOrder: e.target.value })}
                            className={`w-full border-b bg-transparent py-2 text-sm font-light outline-none focus:border-[#CBB279] ${isLightTheme ? 'border-black/10' : 'border-white/10'}`}
                          />
                        </div>
                        <div className="flex items-center justify-between gap-4 xl:items-end">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={mediaForm.isActive}
                              onChange={(e) => setMediaForm({ ...mediaForm, isActive: e.target.checked })}
                              className="accent-[#CBB279]"
                            />
                            <span className="text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Visible</span>
                          </label>
                          <div className="flex items-center gap-3">
                            {isEditingMedia && (
                              <button
                                type="button"
                                onClick={resetMediaForm}
                                className="text-[0.6rem] uppercase tracking-widest text-[#baa98e] hover:underline"
                              >
                                Cancel
                              </button>
                            )}
                            <button
                              type="submit"
                              disabled={isSaving}
                              className="rounded-full bg-[#CBB279] px-6 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#d6b167] disabled:opacity-50"
                            >
                              {isSaving ? (isUploadingMedia ? 'Uploading...' : 'Saving...') : isEditingMedia ? 'Update Media' : 'Add Media'}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>

                    <div className={`rounded-3xl border p-8 ${isLightTheme ? 'bg-[#fcfaf7] border-black/5' : 'bg-[#1e1a15]/40 border-white/5'}`}>
                      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h4 className="text-sm uppercase tracking-widest text-[#CBB279]">
                            {isEditingFeaturedLook ? 'Update Homepage Featured Look' : 'Homepage Featured Looks'}
                          </h4>
                          <p className={`mt-3 max-w-3xl text-sm leading-7 ${isLightTheme ? 'text-[#5f4a34]' : 'text-[#d6c9b4]'}`}>
                            Choose which gallery images appear in the homepage featured looks section and control the card order shown on the frontend.
                          </p>
                        </div>
                      </div>

                      <form onSubmit={handleCreateOrUpdateFeaturedLook} className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                        <div>
                          <label className="mb-2 block text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Card Title</label>
                          <input
                            required
                            type="text"
                            value={featuredLookForm.title}
                            onChange={(e) => setFeaturedLookForm({ ...featuredLookForm, title: e.target.value })}
                            className={`w-full border-b bg-transparent py-2 text-sm font-light outline-none focus:border-[#CBB279] ${isLightTheme ? 'border-black/10' : 'border-white/10'}`}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Tag</label>
                          <input
                            required
                            type="text"
                            value={featuredLookForm.category}
                            onChange={(e) => setFeaturedLookForm({ ...featuredLookForm, category: e.target.value })}
                            className={`w-full border-b bg-transparent py-2 text-sm font-light outline-none focus:border-[#CBB279] ${isLightTheme ? 'border-black/10' : 'border-white/10'}`}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-2 block text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Linked Gallery Image</label>
                          <div className="relative">
                            <select
                              required
                              value={featuredLookForm.mediaFilename}
                              onChange={(e) => setFeaturedLookForm({ ...featuredLookForm, mediaFilename: e.target.value })}
                              className={adminSelectClassName}
                            >
                              <option className={adminSelectOptionClassName} value="">Select a gallery image</option>
                              {activeMediaPreview
                                .filter((item) => item.type === 'image')
                                .map((item) => (
                                  <option className={adminSelectOptionClassName} key={item.id} value={item.filename}>
                                    {item.title}
                                  </option>
                                ))}
                            </select>
                            <ChevronDown className={`pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 ${isLightTheme ? 'text-[#8c6a2d]' : 'text-[#CBB279]'}`} />
                          </div>
                        </div>
                        <div className="md:col-span-2 xl:col-span-2">
                          <label className="mb-2 block text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Outcome Text</label>
                          <input
                            required
                            type="text"
                            value={featuredLookForm.outcome}
                            onChange={(e) => setFeaturedLookForm({ ...featuredLookForm, outcome: e.target.value })}
                            className={`w-full border-b bg-transparent py-2 text-sm font-light outline-none focus:border-[#CBB279] ${isLightTheme ? 'border-black/10' : 'border-white/10'}`}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-[0.6rem] uppercase tracking-widest text-[#CBB279]">Sort Order</label>
                          <input
                            type="number"
                            value={featuredLookForm.sortOrder}
                            onChange={(e) => setFeaturedLookForm({ ...featuredLookForm, sortOrder: e.target.value })}
                            className={`w-full border-b bg-transparent py-2 text-sm font-light outline-none focus:border-[#CBB279] ${isLightTheme ? 'border-black/10' : 'border-white/10'}`}
                          />
                        </div>
                        <div className="flex items-end gap-6">
                          <label className="flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.24em] text-[#CBB279]">
                            <input
                              type="checkbox"
                              checked={featuredLookForm.isActive}
                              onChange={(e) => setFeaturedLookForm({ ...featuredLookForm, isActive: e.target.checked })}
                            />
                            Visible
                          </label>
                        </div>
                        <div className="md:col-span-2 xl:col-span-4 flex flex-wrap items-center gap-4">
                          {isEditingFeaturedLook && (
                            <button
                              type="button"
                              onClick={resetFeaturedLookForm}
                              className="text-[0.6rem] uppercase tracking-widest text-[#baa98e] hover:underline"
                            >
                              Cancel
                            </button>
                          )}
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-full bg-[#CBB279] px-6 py-3 text-[0.65rem] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#d6b167] disabled:opacity-50"
                          >
                            {isSaving ? 'Saving...' : isEditingFeaturedLook ? 'Update Featured Look' : 'Add Featured Look'}
                          </button>
                        </div>
                      </form>

                      <div className="mt-8">
                        <div className="mb-4 text-[0.62rem] uppercase tracking-[0.28em] text-[#CBB279]">Live Preview</div>
                        <div className={`max-w-sm overflow-hidden rounded-[1.6rem] border ${isLightTheme ? 'border-black/5 bg-white' : 'border-white/5 bg-white/[0.02]'}`}>
                          <div className="relative aspect-[4/4.6] overflow-hidden bg-black/10">
                            {featuredLookPreviewCard.previewItem ? (
                              <img
                                src={
                                  featuredLookPreviewCard.previewItem.previewSrc ||
                                  featuredLookPreviewCard.previewItem.posterSrc ||
                                  featuredLookPreviewCard.previewItem.src
                                }
                                alt={featuredLookPreviewCard.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-[linear-gradient(135deg,rgba(214,177,111,0.12),rgba(255,255,255,0.03))]" />
                            )}
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.72))]" />
                            <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-2 text-[0.55rem] uppercase tracking-[0.26em] text-white">
                              {featuredLookPreviewCard.category}
                            </div>
                            <div className="absolute inset-x-0 bottom-0 p-4">
                              <h4 className="text-2xl text-white" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                                {featuredLookPreviewCard.title}
                              </h4>
                            </div>
                          </div>
                          <div className="space-y-3 p-4">
                            <p className={`text-sm leading-6 ${isLightTheme ? 'text-[#5f4a34]' : 'text-[#d6c9b4]'}`}>
                              {featuredLookPreviewCard.outcome}
                            </p>
                            <div className="border-t border-[#CBB279]/10 pt-3 text-[0.58rem] uppercase tracking-[0.24em] text-[#CBB279]">
                              Order {featuredLookPreviewCard.sortOrder}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {activeHomeFeaturedLooks.map((item) => (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={() => setDraggedFeaturedLookId(item.id)}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={async () => {
                              await handleReorderFeaturedLooks(draggedFeaturedLookId, item.id);
                              setDraggedFeaturedLookId(null);
                            }}
                            onDragEnd={() => setDraggedFeaturedLookId(null)}
                            className={`overflow-hidden rounded-[1.6rem] border transition-all ${
                              draggedFeaturedLookId === item.id ? 'scale-[0.98] opacity-60' : ''
                            } ${isLightTheme ? 'border-black/5 bg-white' : 'border-white/5 bg-white/[0.02]'}`}
                          >
                            <div className="relative aspect-[4/4.6] overflow-hidden bg-black/10">
                              {item.previewItem ? (
                                <img
                                  src={item.previewItem.previewSrc || item.previewItem.posterSrc || item.previewItem.src}
                                  alt={item.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-[linear-gradient(135deg,rgba(214,177,111,0.12),rgba(255,255,255,0.03))]" />
                              )}
                              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.72))]" />
                              <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-2 text-[0.55rem] uppercase tracking-[0.26em] text-white">
                                {item.category}
                              </div>
                              <div className="absolute inset-x-0 bottom-0 p-4">
                                <h4 className="text-2xl text-white" style={{ fontFamily: "'Bodoni Moda', serif" }}>{item.title}</h4>
                              </div>
                            </div>
                            <div className="space-y-3 p-4">
                              <p className={`text-sm leading-6 ${isLightTheme ? 'text-[#5f4a34]' : 'text-[#d6c9b4]'}`}>{item.outcome}</p>
                              <div className="flex items-center justify-between border-t border-[#CBB279]/10 pt-3">
                                <span className="text-[0.58rem] uppercase tracking-[0.24em] text-[#CBB279]">
                                  Drag To Reorder
                                </span>
                                <div className="flex items-center gap-4">
                                  <button
                                    type="button"
                                    onClick={() => handleEditFeaturedLook(item)}
                                    className="text-[0.58rem] uppercase tracking-[0.24em] text-[#CBB279]"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteFeaturedLook(item.id)}
                                    className="text-[0.58rem] uppercase tracking-[0.24em] text-red-500/70"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-xl italic" style={{ fontFamily: "'Bodoni Moda', serif" }}>Live Gallery Catalog</h3>
                          <p className={`mt-2 text-sm ${isLightTheme ? 'text-[#6b5540]' : 'text-[#d6c9b4]'}`}>
                            {liveMediaPreview.length > 0
                              ? 'These entries are coming from Google Sheets and control the website gallery.'
                              : 'No live media rows found yet. You are seeing the current bundled Cloudinary gallery preview until you import or add records.'}
                          </p>
                        </div>

                        <div className="flex w-full max-w-2xl flex-col gap-3 md:flex-row md:items-center">
                          <input
                            type="text"
                            placeholder="Search by title, filename, category..."
                            value={mediaSearch}
                            onChange={(e) => setMediaSearch(e.target.value)}
                            className={`flex-1 border-b bg-transparent py-2 text-xs outline-none transition-all focus:border-[#CBB279] ${isLightTheme ? 'border-black/10' : 'border-white/10'}`}
                          />
                          <div className="relative min-w-[11rem]">
                            <select
                              value={mediaTypeFilter}
                              onChange={(e) => setMediaTypeFilter(e.target.value)}
                              className={`${adminSelectClassName} py-2.5 text-xs tracking-[0.24em]`}
                            >
                              <option className={adminSelectOptionClassName} value="all">All Media</option>
                              <option className={adminSelectOptionClassName} value="image">Photos</option>
                              <option className={adminSelectOptionClassName} value="video">Videos</option>
                            </select>
                            <ChevronDown className={`pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 ${isLightTheme ? 'text-[#8c6a2d]' : 'text-[#CBB279]'}`} />
                          </div>
                          <button
                            onClick={syncMediaAdminData}
                            disabled={loading}
                            className="text-[0.6rem] uppercase tracking-widest text-[#CBB279] hover:underline disabled:opacity-50"
                          >
                            {loading ? 'Syncing...' : 'Sync Data'}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                        {filteredMediaPreview.map((item) => {
                          const liveMatch = mediaLibrary.find((entry) => String(entry.id) === String(item.id));
                          return (
                            <button
                              key={item.id}
                              type="button"
                              draggable={Boolean(liveMatch)}
                              onDragStart={(event) => {
                                event.stopPropagation();
                                if (liveMatch) setDraggedMediaId(item.id);
                              }}
                              onDragOver={(event) => {
                                if (!liveMatch) return;
                                event.preventDefault();
                              }}
                              onDrop={async (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                if (!liveMatch) return;
                                await handleReorderMedia(draggedMediaId, item.id);
                                setDraggedMediaId(null);
                              }}
                              onDragEnd={() => setDraggedMediaId(null)}
                              onClick={() => setExpandedMediaItem({ item, liveMatch })}
                              className={`overflow-hidden rounded-[1.6rem] border text-left transition-all hover:-translate-y-0.5 hover:border-[#CBB279]/30 ${
                                draggedMediaId === item.id ? 'scale-[0.98] opacity-60' : ''
                              } ${isLightTheme ? 'bg-white border-black/5' : 'bg-white/[0.02] border-white/5'}`}
                            >
                              <div className="relative aspect-[4/5] overflow-hidden bg-black/5">
                                {renderAdminMediaCardVisual(item)}
                                <div className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-2 text-[0.55rem] font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-sm">
                                  {item.type === 'video' ? 'Video' : 'Photo'}
                                </div>
                              </div>
                              <div className="space-y-3 p-4">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <h4 className="truncate text-sm" style={{ fontFamily: "'Bodoni Moda', serif" }}>{item.title}</h4>
                                  </div>
                                  <span className="rounded-full border border-[#CBB279]/20 px-2 py-1 text-[0.5rem] uppercase tracking-[0.22em] text-[#CBB279]">
                                    {item.indexLabel}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between border-t border-[#CBB279]/10 pt-3">
                                  {liveMatch ? (
                                    <>
                                      <span className="text-[0.58rem] uppercase tracking-[0.24em] text-[#baa98e]">
                                        Drag To Reorder
                                      </span>
                                      <button
                                        type="button"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          handleEditMedia(liveMatch);
                                        }}
                                        className="text-[0.58rem] uppercase tracking-[0.24em] text-[#CBB279]"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          handleDeleteMedia(liveMatch.id);
                                        }}
                                        className="text-[0.58rem] uppercase tracking-[0.24em] text-red-500/70"
                                      >
                                        Delete
                                      </button>
                                    </>
                                  ) : (
                                    <p className="text-[0.58rem] uppercase tracking-[0.24em] text-[#baa98e]">
                                      Import this catalog to enable edit/delete
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
             </Motion.div>
          </div>
          <AnimatePresence>
            {expandedMediaItem && (
              <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
                onClick={() => setExpandedMediaItem(null)}
              >
                <Motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onClick={(event) => event.stopPropagation()}
                  className={`relative w-full max-w-5xl overflow-hidden rounded-[2rem] border ${isLightTheme ? 'border-black/10 bg-[#fcfaf7] text-[#21180f]' : 'border-white/10 bg-[#111] text-white'}`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedMediaItem(null)}
                    className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-3 text-white transition-all hover:bg-black/80"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="grid gap-0 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
                    <div className="relative bg-black">
                      {expandedMediaItem.item.type === 'video' ? (
                        <video
                          src={expandedMediaItem.item.src}
                          className="max-h-[78vh] w-full object-contain"
                          controls
                          autoPlay
                          playsInline
                        />
                      ) : (
                        <img
                          src={expandedMediaItem.item.src || expandedMediaItem.item.previewSrc}
                          alt={expandedMediaItem.item.title}
                          className="max-h-[78vh] w-full object-contain"
                        />
                      )}
                    </div>

                    <div className="flex flex-col gap-5 p-6 lg:p-8">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full border border-[#CBB279]/25 px-3 py-2 text-[0.55rem] uppercase tracking-[0.28em] text-[#CBB279]">
                          {expandedMediaItem.item.type === 'video' ? 'Video' : 'Photo'}
                        </span>
                        <span className="rounded-full border border-[#CBB279]/20 px-3 py-2 text-[0.55rem] uppercase tracking-[0.24em] text-[#CBB279]">
                          {expandedMediaItem.item.category}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-2xl leading-tight" style={{ fontFamily: "'Bodoni Moda', serif" }}>
                          {expandedMediaItem.item.title}
                        </h4>
                        <p className={`mt-4 text-sm leading-7 ${isLightTheme ? 'text-[#5f4a34]' : 'text-[#d6c9b4]'}`}>
                          {expandedMediaItem.item.description}
                        </p>
                      </div>

                      <div className={`rounded-[1.4rem] border px-4 py-4 text-sm leading-7 ${isLightTheme ? 'border-black/6 bg-black/[0.02] text-[#5f4a34]' : 'border-white/8 bg-white/[0.03] text-[#d6c9b4]'}`}>
                        <div><span className="text-[#CBB279]">Filename:</span> {expandedMediaItem.item.filename}</div>
                        <div><span className="text-[#CBB279]">Order:</span> {expandedMediaItem.item.sortOrder ?? 'Auto'}</div>
                        <div><span className="text-[#CBB279]">Source:</span> {expandedMediaItem.liveMatch ? 'Google Sheets' : 'Fallback catalog'}</div>
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-[#CBB279]/10 pt-5">
                        {expandedMediaItem.liveMatch ? (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                handleEditMedia(expandedMediaItem.liveMatch);
                                setExpandedMediaItem(null);
                              }}
                              className="text-[0.62rem] uppercase tracking-[0.26em] text-[#CBB279]"
                            >
                              Edit Media
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleDeleteMedia(expandedMediaItem.liveMatch.id);
                                setExpandedMediaItem(null);
                              }}
                              className="text-[0.62rem] uppercase tracking-[0.26em] text-red-500/70"
                            >
                              Delete Media
                            </button>
                          </>
                        ) : (
                          <p className="text-[0.62rem] uppercase tracking-[0.26em] text-[#baa98e]">
                            Import this catalog to manage this item
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Motion.div>
              </Motion.div>
            )}
          </AnimatePresence>
          <p className="mt-12 text-center text-[0.6rem] opacity-20 uppercase tracking-[0.3em]">&copy; Jiya's Studio Management System | Powered by Kanniyakumarione Infrastructure</p>
       </div>
    </div>
  );
}
