const Contact = require('../../api/v1/contacts/model');
const Address = require('../../api/v1/address/model');
const { NotFoundError, BadRequestError } = require('../../errors');

const getAllContacts = async () => {
  const result = await Contact.find({});

  return result;
};

const createContact = async (contactData) => {
  const { name, email, phone, address, desa, kecamatan, city, zipcode, province, country, latitude, longitude } = contactData;

  try {
    const newAddress = await Address.create({
      address,
      desa,
      kecamatan,
      city,
      zipcode,
      province,
      country,
      geo: {
        latitude,
        longitude,
      },
    });

    const newContact = new Contact({
      name,
      email,
      phone,
      address: newAddress._id,
    });

    const savedContact = await newContact.save();

    return savedContact;
  } catch (error) {
    throw error;
  }
};

const getOneContact = async (id) => {
  const result = await Contact.findOne({
    _id: id,
  }).populate({
		path: 'address',
	});

  if (!result) throw new NotFoundError(`No Contact with id: ${id}`);

  return result;
};

const updateContact = async (id, contactData) => {
  const { name, email, phone, address, desa, kecamatan, city, zipcode, province, country, latitude, longitude } = contactData;

  try {
    const contact = await Contact.findById(id);

    if (!contact) {
      throw new NotFoundError(`Tidak ada kontak dengan ID: ${id}`);
    }

    contact.name = name;
    contact.email = email;
    contact.phone = phone;

    // Temukan alamat terkait berdasarkan ID
    const addressObj = await Address.findById(contact.address);

    if (!addressObj) {
      throw new NotFoundError(`Tidak ada alamat dengan ID: ${contact.address}`);
    }

    // Perbarui bidang alamat
    addressObj.address = address;
    addressObj.desa = desa;
    addressObj.kecamatan = kecamatan;
    addressObj.city = city;
    addressObj.zipcode = zipcode;
    addressObj.province = province;
    addressObj.country = country;
    addressObj.geo.latitude = latitude;
    addressObj.geo.longitude = longitude;

    // Simpan perubahan pada alamat
    await addressObj.save();

    // Simpan perubahan pada kontak
    const savedContact = await contact.save();

    return savedContact;
  } catch (error) {
    throw error;
  }
};

const deleteContact = async (id) => {
  const result = await Contact.findByIdAndDelete(id);

  if (!result) throw new NotFoundError(`No Contact with id: ${id}`);

  return { msg: 'Deleted Successfully' };
};

const checkingContact = async (id) => {
	const result = await Contact.findOne({_id: id});
	if (!result) throw new NotFoundError(`Contact with id :  ${id} Not Found`);
	return result;
};

module.exports = {
  getAllContacts,
  createContact,
  getOneContact,
  updateContact,
  deleteContact,
	checkingContact,
};