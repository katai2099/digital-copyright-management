import "./setting.css";

export const Setting = () => {
  return (
    <div className="home-wrapper">
      <div className="setting-wrapper row">
        <div className="options-area col-sm-3">
          <div className="setting-header left">Settings</div>
          <div className="setting-options">
            <div className="setting-option">
              <i className="las la-user"></i>
              <div className="setting-option-title">Profile</div>
            </div>
            <div className="setting-option">
              <i className="lar la-eye"></i>
              <div className="setting-option-title">View Profile</div>
            </div>
          </div>
        </div>
        <div className="profile-update-area col-sm-8">
          <div className="profile-box">
            <div className="setting-header">Profile</div>
            <div className="personal-info">Public info</div>
            <div className="wallet-info-wrapper">
              <label className="setting-input-label">Wallet Address</label>
              <div className="input-wrapper">
                <input type="text" disabled />
              </div>
            </div>
            <div className="username-wrapper">
              <label className="setting-input-label">Username</label>
              <div className="input-wrapper">
                <input type="text" />
              </div>
            </div>
            <div className="username-note">
              *Note that your username will be publicly available on the
              website. Also your profile can be easily accessed from <br />
              &nbsp;&nbsp;<strong>blabla.com/profile/username</strong>
            </div>
            <div className="personal-info">Personal Info</div>
            <div className="firstname-wrapper">
              <label className="setting-input-label">Firstname</label>
              <div className="input-wrapper">
                <input type="text" />
              </div>
            </div>
            <div className="lastname-wrapper">
              <label className="setting-input-label">Lastname</label>
              <div className="input-wrapper">
                <input type="text" />
              </div>
            </div>
            <div className="lastname-wrapper">
              <label className="setting-input-label">Email</label>
              <div className="input-wrapper">
                <input type="text" />
              </div>
            </div>
            <div className="address-wrapper">
              <label className="setting-input-label">Address</label>
              <div className="input-wrapper">
                <input type="text" />
              </div>
            </div>
            <button className="btn-save-changes">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};
