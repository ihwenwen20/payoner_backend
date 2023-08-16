const Address = require('../../api/v2/address/model');
const { NotFoundError, BadRequestError } = require('../../errors');

const getAllAddresses = async (req) => {
  const result = await Address.find();
  return result;
};

const createAddress = async (req) => {
  const { address, desa, kecamatan, city, zipcode, province, country, latitude, longitude } = req.body;

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
    return newAddress;
  } catch (err) {
    throw err;
  }
};

const getAddressById = async (req) => {
  const { id } = req.params;

  const address = await Address.findById(id);
  if (!address) {
    throw new NotFoundError(`No Address with id: ${id}`);
  }

  return address;
};

const updateAddress = async (req) => {
  const { id } = req.params;
  const { address, desa, kecamatan, city, zipcode, province, country, latitude, longitude } = req.body;

  const check = await Address.findOne({ address, _id: { $ne: id } });
  if (check) {
    throw new BadRequestError('Duplicate Address');
  }

  const updatedAddress = await Address.findByIdAndUpdate(
    id,
    {
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
    },
    { new: true, runValidators: true }
  );

  if (!updatedAddress) {
    throw new NotFoundError(`No Address with id: ${id}`);
  }

  return updatedAddress;
};

const deleteAddress = async (req) => {
  const { id } = req.params;

  const address = await Address.findById(id);
  if (!address) {
    throw new NotFoundError(`No Address with id: ${id}`);
  }

  await address.deleteOne();

  return { msg: 'Deleted Successfully' };
};

const checkingAddress = async (id) => {
  const address = await Address.findById(id);
  if (!address) {
    throw new NotFoundError(`No Address with id: ${id}`);
  }

  return address;
};

module.exports = {
  getAllAddresses,
  createAddress,
  getAddressById,
  updateAddress,
  deleteAddress,
  checkingAddress,
};
