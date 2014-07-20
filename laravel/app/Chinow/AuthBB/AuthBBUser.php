<?php namespace Chinow\AuthBB;

use Illuminate\Auth\UserInterface;
use Config;
use Eloquent;

class AuthBBUser extends Eloquent implements UserInterface {

    public $timestamps = false;
    protected $connection = 'authbb';
    protected $table = 'phpbb_users';
    protected $primaryKey = 'user_id';
    protected $hidden = array('user_password');

	/**
     * Gets the primary key of the phpbb user.
     *
     * @return string
     */
	public function getAuthIdentifier() {
		return $this->getKey();
	}

	/**
     * Gets the hashed password of the phpbb user.
     *
     * @return string
	*/
	public function getAuthPassword() {
		return $this->user_password;
	}

	/**
	 * Get the token value for the "remember me" session.
	 *
	 * @return string
	 */
	public function getRememberToken()
	{
		// TODO
		return $this->remember_token;
	}

	/**
	 * Set the token value for the "remember me" session.
	 *
	 * @param  string  $value
	 * @return void
	 */
	public function setRememberToken($value)
	{
		// TODO
		$this->remember_token = $value;
	}

	/**
	 * Get the column name for the "remember me" token.
	 *
	 * @return string
	 */
	public function getRememberTokenName()
	{
		// TODO
		return 'remember_token';
	}

	/**
	 * Get the e-mail address where password reminders are sent.
	 *
	 * @return string
	 */
	public function getReminderEmail()
	{
		return $this->user_email;
	}

	/**
	 * Authenticate the password using phpBB hash script
	 *
	 * @return bool
	 */
	public function checkHash(UserInterface $user, array $credentials)
	{
		define('IN_PHPBB', true);
		$phpbb_root_path = Config::get('phpbb.phpbb_root_path');
	    define('ROOT_PATH', $phpbb_root_path);
	    $phpEx = 'php';
	    require_once($phpbb_root_path . 'includes/functions.php');

	    return phpbb_check_hash($credentials['password'], $user->user_password);  //$H$9daZ39CbhcRF7Uuddz0.UdE1Sfo8kd/
	}


}