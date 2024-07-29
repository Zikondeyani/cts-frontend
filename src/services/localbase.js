import Localbase from 'localbase';

const db = new Localbase('db-cts');
let nextId = 1; // Initialize a counter for auto-incrementing IDs

export const saveDataOffline = async (collection, document) => {
  try {
    if (!document.id) {
      document.id = nextId++; // Assign and then increment for the next document
    }

    let uniqueId = document.id; // Ensure uniqueId is a number

    // Save document with numeric key
    await db.collection(collection).add(document, uniqueId);
 //   console.log('Document saved with ID:', uniqueId);
  } catch (err) {
    console.error('Error saving data to Localbase', err);
  }
};

export const getDataOffline = async (collection) => {
  try {
    return await db.collection(collection).get();
  } catch (err) {
    console.error('Error getting data from Localbase', err);
    return [];
  }
};

export const removeDataOffline = async (collection, documentId) => {
  try {
    await db.collection(collection).doc({ id: documentId }).delete();
  } catch (err) {
    console.error('Error removing data from Localbase', err);
  }
};

export const clearDataOffline = async (collection) => {
  try {
    await db.collection(collection).delete();
  } catch (err) {
    console.error('Error clearing Localbase data', err);
  }
};
export const updateDataOffline = async (collection, documentId, updatedFields) => {
  try {
    // Update document using numeric key
    await db.collection(collection).doc({ id: documentId }).update(updatedFields);
  } catch (err) {
    console.log('Error updating data in Localbase', err);
  }
};
export const getOfflineLoadingPlans = async () => {
  try {
    // Fetch loading plans with keys
    const loadingPlansSnapshot = await db.collection('loading-plans').get();
    const loadingPlansWithKeys = loadingPlansSnapshot.map(doc => ({
      ...doc,
      key: doc.id  // Assuming 'id' is the key in Localbase
    }));

    // Fetch related data from Localbase
    const transporters = await db.collection('transporters').get();
    const commodities = await db.collection('commodities').get();
    const districts = await db.collection('districts').get();
    const projects = await db.collection('projects').get();
    const warehouses = await db.collection('warehouses').get();

    // Map related data to loading plans
    const loadingPlansWithRelations = loadingPlansWithKeys.map(plan => ({
      ...plan,
      transporter: transporters.find(t => t.id === plan.transporterId),
      commodity: commodities.find(c => c.id === plan.commodityId),
      district: districts.find(d => d.id === plan.districtId),
      project: projects.find(p => p.id === plan.projectId),
      warehouse: warehouses.find(w => w.id === plan.warehouseId),
    }));

    return loadingPlansWithRelations;
  } catch (err) {
    console.error('Error getting loading plans from Localbase', err);
    return [];
  }
};


export const getDataOfflineWithKeys = async (collection) => {
  try {
    const docs = await db.collection(collection).get();
    const docsWithKeys = docs.map(doc => ({ key: doc.id, ...doc }));
    return docsWithKeys;
  } catch (err) {
    console.error('Error getting data from Localbase', err);
    return [];
  }
};


