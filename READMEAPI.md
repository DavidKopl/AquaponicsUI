const dataCreateDtoIn = {
  sensor_id: 'sensor_001',
  temperature: 24.5,
  humidity: 60,
  target_vpd: 1.2,
  co2: 450,
  ec: 1.5,
  ph: 6.2,
  do_value: 7.8,
  adc_readings: {
    adc0_EC: 110,
    adc1_Ph: 222,
    adc2_DO: 333,
  },
  relays: {
    relay1_hum_minus: false,
    relay2_temp_minus: true,
    relay3_temp_plus: false,
    relay4_co2_plus: true,
  },
  errors: {
    temp_hum_err: false,
    EC_error: false,
    Ph_error: false,
    DO_error: false,
  },
};

const dataCreateDtoInType = {
  sensor_id: String(1, 255).isRequired(),
  temperature: Number(-50, 100).isRequired(),
  humidity: Number(0, 100).isRequired(),
  target_vpd: Number(0, Infinity).isRequired(),
  co2: Number(400, 5000).isRequired(),
  ec: Number(0, Infinity).isRequired(),
  ph: Number(0, 14).isRequired(),
  do_value: Number(0, Infinity).isRequired(),
  adc_readings: {
    adc0_EC: Number().isRequired(),
    adc1_Ph: Number().isRequired(),
    adc2_DO: Number().isRequired(),
  },
  relays: {
    relay1_hum_minus: Boolean().isRequired(),
    relay2_temp_minus: Boolean().isRequired(),
    relay3_temp_plus: Boolean().isRequired(),
    relay4_co2_plus: Boolean().isRequired(),
  },
  errors: {
    temp_hum_err: Boolean().isRequired(),
    EC_error: Boolean().isRequired(),
    Ph_error: Boolean().isRequired(),
    DO_error: Boolean().isRequired(),
  },
};

const dataCreateDtoOut = {
  id: '624fb0fe1f1b2b001f31d1d3',
  status: 'ok',
  message: 'Data received and valid!',
};

const dataCreateDtoOutType = {
  id: id().isRequired(),
  status: oneOf(['ok', 'error']).isRequired(),
  message: String(1, 255).isRequired(),
};
