const token = "AIzaSyByKzqNSKVVFLr9f_kMv-b3JFj3xxGMSCE";
class Helper {
  getXHRHeaders() {
    return {
      headers: {
        Authorization: `Token ${token}`,
      },
    };
  }
}

const instance = new Helper();
export default instance;
