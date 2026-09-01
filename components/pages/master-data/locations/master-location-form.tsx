/* eslint-disable react-hooks/exhaustive-deps */
import Card from "@sera-components/card";
import RsFormBuilder from "@sera-components/rs-form-builder";
import { ChildConfig } from "@sera-libraries/types/formBuilderType";
import {
  cityActions,
  districtActions,
  locationTypeActions,
  provinceActions,
  RootState,
} from "@sera-redux";
import { AutoCompleteType } from "@sera-types/base.type";
import { CityState } from "@sera-types/cities.type";
import { DistrictState } from "@sera-types/districts.type";
import { LocationState } from "@sera-types/location.type";
import { LocationTypeState } from "@sera-types/location-type.type";
import { ProvinceState } from "@sera-types/provinces.type";
import { setFormErrorHandle } from "@sera-utils/error-handler";
import Utils from "@sera-utils/utils";
import { FormInstance } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

interface ActionFormProps {
  type: "create" | "update";
  form: FormInstance;
  loading: boolean;
  onSubmit: () => void;
  locations: LocationState;
  provinces: ProvinceState;
  cities: CityState;
  districts: DistrictState;
  locationTypes: LocationTypeState;
  getDropdownLocationTypes: typeof locationTypeActions.getDropdownLocationTypesFetch;
  getDropdownProvinces: typeof provinceActions.getDropdownProvincesFetch;
  getDropdownCities: typeof cityActions.getDropdownCitiesFetch;
  getDropdownDistricts: typeof districtActions.getDropdownDistrictsFetch;
  clearDropdownCities: typeof cityActions.getDropdownCitiesClear;
  clearDropdownDistricts: typeof districtActions.getDropdownDistrictsClear;
}

const ActionForm = ({
  type,
  form,
  loading,
  onSubmit,
  locations,
  locationTypes,
  provinces,
  cities,
  districts,
  getDropdownLocationTypes,
  getDropdownProvinces,
  getDropdownCities,
  getDropdownDistricts,
  clearDropdownCities,
  clearDropdownDistricts,
}: ActionFormProps) => {
  const router = useRouter();

  const { t } = useTranslation(undefined, { keyPrefix: "location.form" });

  const requiredMessage = t("input.message");

  const onGoBack = () => Utils().onGoBack(router, "/master-data/locations");
  const [dataDropdownTypes, setDataDropdownTypes] = useState<
    AutoCompleteType[]
  >([]);

  const [dataDropdownProvinces, setDataDropdownProvinces] = useState<
    AutoCompleteType[]
  >([]);
  const [dataDropdownCities, setDataDropdownCities] = useState<
    AutoCompleteType[]
  >([]);
  const [dataDropdownDistricts, setDataDropdownDistricts] = useState<
    AutoCompleteType[]
  >([]);

  const handlerSelectProvince = (value?: string) => {
    form.setFieldValue("cityId", null);
    form.setFieldValue("districtId", null);
    form.setFieldValue("area", null);

    if (value) {
      getDropdownCities({
        provinceId: value,
        page: 0,
        limit: 0,
      });
    } else {
      clearDropdownCities();
      clearDropdownDistricts();
    }
  };
  const handlerSelectCity = (value?: string) => {
    form.setFieldValue("districtId", null);
    form.setFieldValue("area", null);
    if (value) {
      getDropdownDistricts({
        cityId: value,
        page: 0,
        limit: 0,
      });
    } else {
      clearDropdownDistricts();
    }
  };
  const handlerSelectDistrict = (value?: string) => {
    form.setFieldValue("area", null);
    if (districts.dropdownDistricts.data) {
      const selectedDistrict = districts.dropdownDistricts.data.find(
        (district) => district.id === value,
      );
      if (selectedDistrict) {
        form.setFieldValue("area", selectedDistrict.area);
      }
    }
  };

  const branchForm: ChildConfig[] = [
    {
      id: "name",
      type: "text",
      name: "name",
      label: t("input.name.label"),
      placeholder: t("input.name.placeholder"),
      rules: [
        { required: true, message: requiredMessage },
        {
          pattern: /^[^.]*$/,
          message: t("input.invalidFormat"),
        },
      ],
      maxLength: 50,
      showCount: true,
    },
    {
      type: "select",
      label: t("input.type.label"),
      name: "type",
      id: "type",
      placeholder: t("input.type.placeholder"),
      options: dataDropdownTypes,
      rules: [{ required: true, message: requiredMessage }],
    },
    {
      id: "address",
      type: "text",
      name: "address",
      label: t("input.address.label"),
      placeholder: t("input.address.placeholder"),
      maxLength: 200,
      showCount: true,
    },
    {
      id: "provinceId",
      type: "select",
      name: "provinceId",
      label: t("input.province.label"),
      placeholder: t("input.province.placeholder"),
      options: dataDropdownProvinces,
      rules: [{ required: true, message: requiredMessage }],
      onChange: (value) => handlerSelectProvince(value),
    },
    {
      id: "cityId",
      type: "select",
      name: "cityId",
      label: t("input.city.label"),
      placeholder: t("input.city.placeholder"),
      options: dataDropdownCities,
      rules: [{ required: true, message: requiredMessage }],
      dependency: {
        fields: [],
        disabled: () => dataDropdownCities.length === 0,
      },
      onChange: (value) => handlerSelectCity(value),
    },
    {
      id: "districtId",
      type: "select",
      name: "districtId",
      label: t("input.district.label"),
      placeholder: t("input.district.placeholder"),
      options: dataDropdownDistricts,
      rules: [{ required: true, message: requiredMessage }],
      dependency: {
        fields: [],
        disabled: () => dataDropdownDistricts.length === 0,
      },
      onChange: (value) => handlerSelectDistrict(value),
    },
    {
      type: "text",
      label: t("input.area.label"),
      name: "area",
      id: "area",
      placeholder: t("input.area.placeholder"),
      dependency: {
        fields: [],
        disabled: () => true,
      },
    },
    {
      id: "coordinate",
      type: "text",
      name: "coordinate",
      label: t("input.coordinate.label"),
      placeholder: t("input.coordinate.placeholder"),
      maxLength: 50,
      showCount: true,
      onChange: (value) => value?.trim().replace(/\s+/g, "") || "",
      rules: [
        {
          required: true,
          message: requiredMessage,
        },
        {
          pattern: /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/,
          message: t("input.coordinate.formatValidation"),
        },
      ],
    },
  ];

  useEffect(() => {
    setDataDropdownTypes(
      locationTypes.dropdownLocationTypes.data
        .filter((type) => type.name?.toLowerCase() !== "customer location")
        .map((type) => ({
          label: type.name,
          value: type.name,
        })),
    );
  }, [locationTypes.dropdownLocationTypes.data]);
  /** ▪ Dropdown Provinces */
  useEffect(() => {
    setDataDropdownProvinces(
      [...(provinces.dropdownProvinces.data ?? [])]
        .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
        .map((province) => ({
          label: province.name,
          value: province.id,
        })),
    );
  }, [provinces.dropdownProvinces.data]);

  /** ▪ Dropdown Cities */
  useEffect(() => {
    setDataDropdownCities(
      [...(cities.dropdownCities.data ?? [])]
        .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
        .map((city) => ({
          label: city.name,
          value: city.id,
        })),
    );
  }, [cities.dropdownCities.data]);

  /** ▪ Dropdown Districts */
  useEffect(() => {
    setDataDropdownDistricts(
      [...(districts.dropdownDistricts.data ?? [])]
        .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
        .map((district) => ({
          label: district.name,
          value: district.id,
        })),
    );
  }, [districts.dropdownDistricts.data]);

  useEffect(() => {
    setFormErrorHandle(form, locations?.error);
  }, [locations?.error]);

  useEffect(() => {
    if (locations?.locationDetail?.data) {
      const {
        name,
        address,
        area,
        coordinate,
        province,
        city,
        district,
        type,
      } = locations.locationDetail.data;
      form.setFieldValue("name", name);
      form.setFieldValue("address", address);
      form.setFieldValue("area", area);
      form.setFieldValue("coordinate", coordinate);
      form.setFieldValue("provinceId", province?.id);
      form.setFieldValue("cityId", city?.id);
      form.setFieldValue("districtId", district?.id);
      form.setFieldValue("type", type);

      if (province?.id) {
        getDropdownCities({
          provinceId: province?.id,
          page: 0,
          limit: 0,
        });
      }

      if (city?.id) {
        getDropdownDistricts({
          cityId: city?.id,
          page: 0,
          limit: 0,
        });
      }
    }
  }, [locations.locationDetail.data]);

  useEffect(() => {
    getDropdownLocationTypes();
    getDropdownProvinces();
  }, []);

  return (
    <Card
      title={
        Object.entries(locations?.locationDetail?.data)?.length > 0
          ? t("title.edit")
          : t("title.add")
      }
    >
      <RsFormBuilder
        type={type}
        layout="vertical"
        name={""}
        form={form}
        onFinish={onSubmit}
        onCancel={onGoBack}
        configs={branchForm}
        submitText={t("button.save")}
        cancelText={t("button.cancel")}
        loading={loading}
        disabled={loading}
      />
    </Card>
  );
};
const mapStateToProps = (state: RootState) => ({
  locations: state.locations,
  locationTypes: state.locationTypes,
  provinces: state.provinces,
  cities: state.cities,
  districts: state.districts,
});

const mapDispatchToProps = {
  getDropdownLocationTypes: locationTypeActions.getDropdownLocationTypesFetch,
  getDropdownProvinces: provinceActions.getDropdownProvincesFetch,
  getDropdownCities: cityActions.getDropdownCitiesFetch,
  getDropdownDistricts: districtActions.getDropdownDistrictsFetch,
  clearDropdownCities: cityActions.getDropdownCitiesClear,
  clearDropdownDistricts: districtActions.getDropdownDistrictsClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionForm);
