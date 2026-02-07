import { Hotel } from "./types";

export const HOTELS: Hotel[] = [
  {
    id: "1",
    name: "汉庭酒店(上海青浦城中北路店)",
    rating: 4.8,
    reviewCount: 390,
    stars: 2,
    address: "青浦区青赵公路116号1幢",
    distance: "距青浦新城地铁站步行1.8公里",
    minPrice: 198,
    images: [
      "https://images.unsplash.com/photo-1742844552048-410dfdf7b3c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBob3RlbCUyMGV4dGVyaW9yJTIwaW50ZXJpb3IlMjBsb2JieSUyMHJvb218ZW58MXx8fHwxNzcwMzkzMjMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1759264244746-140bbbc54e1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsJTIwcm9vbSUyMGRlc2lnbiUyMGx1eHVyeXxlbnwxfHx8fDE3NzAzOTMyMzR8MA"
    ],
    tags: ["免费停车", "机器人服务", "洗衣房", "自助入住"],
    facilities: ["Wi-Fi", "Parking", "Robot", "Laundry"],
    rooms: [
      {
        id: "r1",
        name: "大床房",
        price: 198,
        description: "1张1.8米大床 18m² 2人入住 1层",
        image: "https://images.unsplash.com/photo-1759264244746-140bbbc54e1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsJTIwcm9vbSUyMGRlc2lnbiUyMGx1eHVyeXxlbnwxfHx8fDE3NzAzOTMyMzR8MA",
        tags: ["含早餐", "双床房"]
      },
      {
        id: "r2",
        name: "双床房",
        price: 218,
        description: "2张1.2米单人床 22m² 2人入住 2-5层",
        image: "https://images.unsplash.com/photo-1731080647322-f9cf691d40ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNvcnQlMjBzd2ltbWluZyUyMHBvb2wlMjBob3RlbHxlbnwxfHx8fDE3NzAzOTMyMzh8MA",
        tags: ["限时优惠", "双份早餐"]
      }
    ]
  },
  {
    id: "2",
    name: "如家派柏云酒店(上海浦东德平路地铁站店)",
    rating: 4.7,
    reviewCount: 443,
    stars: 2,
    address: "浦东新区德平路地铁站附近",
    distance: "近上海新国际博览中心",
    minPrice: 120,
    images: [
      "https://images.unsplash.com/photo-1759264244746-140bbbc54e1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsJTIwcm9vbSUyMGRlc2lnbiUyMGx1eHVyeXxlbnwxfHx8fDE3NzAzOTMyMzR8MA"
    ],
    tags: ["家庭房", "洗衣房", "新开业", "智能客控"],
    facilities: ["Wi-Fi", "Smart Control", "Laundry"],
    rooms: [
      {
        id: "r3",
        name: "经济房",
        price: 120,
        description: "1张1.5米中床 15m² 1人入住 无窗",
        image: "https://images.unsplash.com/photo-1759264244746-140bbbc54e1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3V0aXF1ZSUyMGhvdGVsJTIwcm9vbSUyMGRlc2lnbiUyMGx1eHVyeXxlbnwxfHx8fDE3NzAzOTMyMzR8MA",
        tags: ["单间"]
      }
    ]
  },
  {
    id: "3",
    name: "上海外滩东方美仑美奂酒店",
    rating: 4.9,
    reviewCount: 8939,
    stars: 5,
    address: "南京路步行街附近",
    distance: "近外滩·南京路步行街",
    minPrice: 1159,
    images: [
      "https://images.unsplash.com/photo-1731080647322-f9cf691d40ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNvcnQlMjBzd2ltbWluZyUyMHBvb2wlMjBob3RlbHxlbnwxfHx8fDE3NzAzOTMyMzh8MA"
    ],
    tags: ["设计型酒店", "艺术氛围", "榻榻米房", "日落美景"],
    facilities: ["Pool", "Gym", "Spa", "Bar"],
    rooms: [
      {
        id: "r4",
        name: "江景大床房",
        price: 1159,
        description: "1张2米特大床 45m² 2人入住 15-20层",
        image: "https://images.unsplash.com/photo-1731080647322-f9cf691d40ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNvcnQlMjBzd2ltbWluZyUyMHBvb2wlMjBob3RlbHxlbnwxfHx8fDE3NzAzOTMyMzh8MA",
        tags: ["含晚宴", "江景"]
      }
    ]
  }
];
