<?php



class LoginController extends BaseController {

    public function postIndex()
    {
        $username = Input::get('username');
        $password = Input::get('password');
        //$username = 'admin';
       // $password = 'Y8VC48CT';

        $message = "Erreur de connexion";
        $success = false;
     
        if (Auth::attempt(array('username' => $username, 'password' => $password), true))
        {
            $message = "";
            $success = true;
        }

        $response_data = array('message' => $message,
        'user' =>  Auth::user(),
        'success' => $success);

        $response = new Illuminate\Http\Response(
            $response_data,
            200,
            ['']
        );
        return $response_data;
    }

    public function getLogged(){
        if(!Auth::guest())
        {
            return Auth::user();
        }
    }

    public function getLogout(){
        if(!Auth::guest())
        {
           Auth::logout();
        }
    }

    public function postProfile()
    {

    }

    public function anyLogin()
    {
        //
    }

}