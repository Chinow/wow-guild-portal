<?php namespace Chinow\AuthBB;

use Illuminate\Auth\GenericUser;
use Illuminate\Auth\UserInterface;
use Illuminate\Auth\UserProviderInterface;
use Chinow\AuthBB\AuthBBUser;

class AuthBBUserProvider implements UserProviderInterface
{
	private $user;

	/**
	 * The Eloquent user model.
	 *
	 * @var string
	 */
	protected $storedToken;


	/**
	* Retrieve a user by their unique identifier.
	*
	* @param  mixed  $id
	* @return \Illuminate\Auth\UserInterface|null
	*/
	public function retrieveById($id)
	{
		return AuthBBUser::find($id);
	}


	/**
	* Retrieve a user by the given credentials.
	* DO NOT TEST PASSWORD HERE!
	*
	* @param  array  $credentials
	* @return \Illuminate\Auth\UserInterface|null
	*/
	public function retrieveByCredentials(array $credentials)
	{
		$username = trim(strtolower($credentials['username']));
		$user = AuthBBUser::where('username_clean', '=', $username)->get()->first();
		return $user;
	}


	/**
	* Validate a user against the given credentials.
	*
	* @param  \Illuminate\Auth\UserInterface  $user
	* @param  array  $credentials
	* @return bool
	*/
	public function validateCredentials(UserInterface $user, array $credentials)
	{
		$authbb = new AuthBBuser;
		return $authbb->checkHash($user, $credentials);
	   
	}

	/**
	 * Retrieve a user by by their unique identifier and "remember me" token.
	 *
	 * @param  mixed  $identifier
	 * @param  string  $token
	 * @return \Illuminate\Auth\UserInterface|null
	 */
	public function retrieveByToken($identifier, $token)
	{
		$storedToken = $this->createModel();

		return $storedToken->newQuery()
                        ->where($storedToken->getKeyName(), $identifier)
                        ->where($storedToken->getRememberTokenName(), $token)
                        ->first();
	}

	/**
	 * Update the "remember me" token for the given user in storage.
	 *
	 * @param  \Illuminate\Auth\UserInterface  $user
	 * @param  string  $token
	 * @return void
	 */
	public function updateRememberToken(UserInterface $user, $token)
	{
		$user->setAttribute($user->getRememberTokenName(), $token);

		$user->save();
	}

	/**
	 * Create a new instance of the model.
	 *
	 * @return \Illuminate\Database\Eloquent\Model
	 */
	public function createModel()
	{
		$class = '\\'.ltrim($this->storedToken, '\\');

		return new $class;
	}
} 