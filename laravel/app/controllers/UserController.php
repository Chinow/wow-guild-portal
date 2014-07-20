<?php



class UserController extends BaseController {

    public function getIndex()
    {

        if (Auth::check())
        {
            return User::all();
            //return Redirect::intended('dashboard');
        }else {
           
        }

        //return User::all();
    }

    public function postProfile()
    {

    }

    public function anyLogin()
    {
        //
    }

}