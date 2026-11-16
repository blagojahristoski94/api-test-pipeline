import postApiFEWBetslip from './FEWBetslip/postApi';
import getApiFEMobile from './FEMobile/getApi';
import getApiFEWBetslip from './FEWBetslip/getApi';
import getApiFEWHome from './FEWHome/getApi';
import getApiFEWMatches from './FEWMatches/getApi';
import getApiFEWPlayer from './FEWPlayer/getApi';
import getApiFEWFixture from './FEWFixture/getApi';
import postApiFEMobile from './FEMobile/postApi';
import postApiPAM from './PAM/postApi';
import getApiFECoupon from './FECoupon/getApi';
import postApiReserveBetSlip from './ReserveBetSlip/postApi';
import getApiFEWFreeBet from './FEWFreeBet/getApi';
import postApiFEWFixture from './FEWFixture/postApi';
import postApiFEABetslip from './FEABetslip/postApi';
import getApiBetBuilder from './FEWAlgoBet/getApi';
import postApiFEWAlgoBet from './FEWAlgoBet/postApi';
import getApiFEHome from './FEHome/getApi';
import getApiCombinedSlider from './CombinedSlider/getApi';
import getApiFEWTopEvents from './FEWTopEvents/getApi';


export class PomProvider {
  getApiFEMobile: getApiFEMobile;
  postApiFEMobile: postApiFEMobile;
  getApiFEWHome: getApiFEWHome;
  getApiFEWPlayer: getApiFEWPlayer;
  getApiFEWMatches: getApiFEWMatches;
  getApiFEWBetslip: getApiFEWBetslip;
  postApiFEWBetslip: postApiFEWBetslip;
  getApiFEWFixture: getApiFEWFixture;
  postApiFEWFixture: postApiFEWFixture;
  postApiPAM: postApiPAM;
  postApiReserveBetSlip: postApiReserveBetSlip;
  getApiFECoupon: getApiFECoupon;
  getApiFEWFreeBet: getApiFEWFreeBet;
  postApiFEABetslip: postApiFEABetslip;
  getApiBetBuilder: getApiBetBuilder;
  postApiFEWAlgoBet: postApiFEWAlgoBet;
  getApiFEHome: getApiFEHome
  getApiCombinedSlider: getApiCombinedSlider;
  getApiFEWTopEvents: getApiFEWTopEvents;


  constructor() {
    this.getApiFEMobile = new getApiFEMobile();
    this.getApiFEWHome = new getApiFEWHome();
    this.getApiFEWPlayer = new getApiFEWPlayer();
    this.getApiFEWMatches = new getApiFEWMatches();
    this.getApiFEWBetslip = new getApiFEWBetslip();
    this.postApiFEWBetslip = new postApiFEWBetslip();
    this.getApiFEWFixture = new getApiFEWFixture();
    this.postApiFEWFixture = new postApiFEWFixture();
    this.postApiFEMobile = new postApiFEMobile();
    this.postApiPAM = new postApiPAM();
    this.postApiReserveBetSlip = new postApiReserveBetSlip();
    this.getApiFECoupon = new getApiFECoupon();
    this.getApiFEWFreeBet = new getApiFEWFreeBet();
    this.postApiFEABetslip = new postApiFEABetslip();
    this.getApiBetBuilder = new getApiBetBuilder();
    this.postApiFEWAlgoBet = new postApiFEWAlgoBet();
    this.getApiFEHome = new getApiFEHome();
    this.getApiCombinedSlider = new getApiCombinedSlider();
    this.getApiFEWTopEvents = new getApiFEWTopEvents();
  }
}