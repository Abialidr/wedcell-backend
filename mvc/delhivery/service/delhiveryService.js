const axios = require("axios");
const ShopNowUserModels = require("../../shop now user/models/ShopNowUserModels");

const DelhiveryService = () => {
  const checkPIN = async (pincode) => {
    // const pincode = '700121';
    try {
      const apiToken = process.env.apiToken;
      const url = `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${apiToken}`,
      };

      const { data } = await axios.get(url, { headers });
      console.log("🚀 ~ checkPIN ~ data:", data.delivery_codes);
      return data;
    } catch (e) {
      console.log("🚀 ~ checkPIN ~ e:", e);
      return;
    }
  };
  const check_charges = async (pincode, weight) => {
    // const pincode = '700121';
    const apiToken = process.env.apiToken;
    const url = `https://track.delhivery.com/api/kinko/v1/invoice/charges/.json`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${apiToken}`,
    };
    try {
      const { data } = await axios.get(url, {
        headers: headers,
        params: {
          md: "S", // Replace with your pickup postcode
          ss: "Delivered",
          d_pin: pincode,
          o_pin: 110011,
          cgm: weight,
        },
      });
      return data;
    } catch (e) {
      console.error(e);
      return e;
    }
  };
  const create_warehouse = async (payload) => {
    // const pincode = '700121';
    const apiToken = process.env.apiToken;
    const url = `https://track.delhivery.com/api/backend/clientwarehouse/create/`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${apiToken}`,
    };

    try {
      const { data } = await axios.post(url, payload, {
        headers: headers,
      });
      console.log(data);
      return data;
    } catch (e) {
      console.error(e);
      return e;
    }
  };
  const update_warehouse = async (payload) => {
    console.log("payload", payload);
    // const pincode = '700121';
    const apiToken = process.env.apiToken;
    const url = `https://track.delhivery.com/api/backend/clientwarehouse/edit/`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${apiToken}`,
    };

    try {
      const { data } = await axios.post(url, payload, {
        headers: headers,
      });
      console.log(data);
      return data;
    } catch (e) {
      console.error(e);
      return e;
    }
  };
  const createShipping = async (data, mode) => {
    console.log("DATAAAAA", data);
    // const pincode = '700121';
    let codAmount;
    const apiToken = process.env.apiToken;
    const url = `https://track.delhivery.com/api/cmu/create.json`;
    const shopkeeper = await ShopNowUserModels.findById(data.shopkeeperId);
    console.log(shopkeeper);
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Token ${apiToken}`,
    };
    mode == "COD"
      ? (codAmount = Math.ceil(
          (data.amount * data.quantity + data.shipping) / 100
        ))
      : (codAmount = 0);
    const rawData = `format=json&data=${encodeURIComponent(
      JSON.stringify({
        shipments: [
          {
            add: data.shippingAddress.address1,
            address_type: "home",
            phone: data.shippingAddress.number.toString(),
            payment_mode: mode,
            name: data.shippingAddress.name,
            pin: data.shippingAddress.pincode.toString(),
            order: data._id.toString(),
            country: "India",
            cod_amount: codAmount,
            quantity: data.quantity,
            weight: data.weight * data.quantity,
            waybill: "",
            shipping_mode: "Surface",
          },
        ],
        pickup_location: {
          name:
            shopkeeper.name +
            shopkeeper.warehouse_address[0].pincode.toString(),
          city: shopkeeper.warehouse_address[0].city,
          pin: shopkeeper.warehouse_address[0].pincode,
          country: shopkeeper.warehouse_address[0].country,
          phone: shopkeeper.mobile,
          add:
            shopkeeper.warehouse_address[0].address1 +
            shopkeeper.warehouse_address[0].address2,
        },
      })
    )}`;

    const response = await axios.post(url, rawData, { headers: headers });
    console.log(response.data);
    return response.data;
  };
  const cancelShipping = async (waybill) => {
    // const pincode = '700121';
    const apiToken = process.env.apiToken;
    const url = `https://track.delhivery.com/api/p/edit`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${apiToken}`,
    };
    const rawData = {
      waybill: waybill,
      cancellation: "true",
    };

    const response = await axios.post(url, rawData, { headers: headers });
    console.log(response.data);
    return response.data.status;
    // const resp = await xml2js.parseString(response.data, (err, result) => {
    //   if (err) {
    //     console.error("Error parsing XML:", err);
    //     return;
    //   }
    //   return(result.root.status[0])
    //   // You can access other parts of the response similarly
    // });
    // return (resp)
  };
  const packingSlip = async (waybill) => {
    // const pincode = '700121';
    console.log(waybill);
    const apiToken = process.env.apiToken;
    const url = `https://track.delhivery.com/api/p/packing_slip`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${apiToken}`,
    };
    const query = {
      wbns: waybill,
      pdf: "true",
    };

    const response = await axios.get(url, {
      headers: headers,
      params: query,
    });
    console.log("abc", response.data);
    return response.data.packages[0].pdf_download_link;
    // const resp = await xml2js.parseString(response.data, (err, result) => {
    //   if (err) {
    //     console.error("Error parsing XML:", err);
    //     return;
    //   }
    //   return(result.root.status[0])
    //   // You can access other parts of the response similarly
    // });
    // return (resp)
  };

  return {
    checkPIN: checkPIN,
    check_charges: check_charges,
    createShipping: createShipping,
    cancelShipping: cancelShipping,
    packing_slip: packingSlip,
    create_warehouse: create_warehouse,
    update_warehouse: update_warehouse,
  };
};

module.exports = DelhiveryService();
