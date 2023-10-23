package com.example.edumatch.activities;

import static com.example.edumatch.util.LoginSignupHelper.printSharedPreferences;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import com.example.edumatch.views.LabelAndEditTextView;
import com.example.edumatch.R;


public class AccountInformationActivity extends AppCompatActivity {

    final static String TAG = "SignUpFlow";

    SharedPreferences sharedPreferences;
    SharedPreferences.Editor editor;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_account_information);



        initSharedPreferences();

        initFields();

        initInvisibleFields();

        initNextButton();

    }



    private void initInvisibleFields() {

        if (sharedPreferences.getBoolean("useGoogle", false)) {
            int[] viewIds = {R.id.create_userName, R.id.create_password};

            for (int i = 0; i < viewIds.length; i++) {
                LabelAndEditTextView view = findViewById(viewIds[i]);
                view.setVisibility(View.GONE);
            }
        }
    }

    private void initNextButton() {
        Button nextButton = findViewById(R.id.next_button);
        nextButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                boolean verified = verifyFields();
                if (verified == true) {
                    goToNewActivity();
                }
            }
        });
    }

    private void initSharedPreferences() {
        sharedPreferences = getSharedPreferences("AccountPreferences", Context.MODE_PRIVATE);
        editor = sharedPreferences.edit();
    }

    private void updatePreferences() {
        int[] viewIds = {R.id.create_name, R.id.create_email, R.id.create_phone_number, R.id.create_userName, R.id.create_password, R.id.create_bio};
        String[] keys = {"name", "email", "phoneNumber", "username", "password", "bio"};

        int numberOfIters = viewIds.length;
        if (sharedPreferences.getBoolean("useGoogle", false)) {
            numberOfIters = viewIds.length - 2;
        }
        for (int i = 0; i < numberOfIters; i++) {
            LabelAndEditTextView view = findViewById(viewIds[i]);
            String userDataString = view.getEnterUserEditText().getText().toString();
            editor.putString(keys[i], userDataString);
            editor.commit();
        }
    }

    private void goToNewActivity() {
        updatePreferences();
        printSharedPreferences(sharedPreferences);
        Intent newIntent;
        if(sharedPreferences.getBoolean("isEditing",false)){
            //todo do a PUT here (make a common function)
            newIntent = new Intent(AccountInformationActivity.this, EditProfileListActivity.class);
        } else {
            newIntent = new Intent(AccountInformationActivity.this, UniversityInformationActivity.class);
        }
        startActivity(newIntent);
    }


    private boolean verifyFields() {
        // todo need an api call to make sure username is unique?
        int[] viewIds = {R.id.create_name, R.id.create_email, R.id.create_userName, R.id.create_password};

        int numberOfIters = viewIds.length;
        if (sharedPreferences.getBoolean("useGoogle", false)) {
            numberOfIters = viewIds.length - 2;
        }
        for (int i = 0; i < numberOfIters; i++) {
            LabelAndEditTextView view = findViewById(viewIds[i]);
            String userDataString = view.getEnterUserEditText().getText().toString().trim();
            if (userDataString.isEmpty()) {
                view.getEnterUserEditText().setError("This field is required");
                view.getEnterUserEditText().requestFocus();
                return false;
            }
        }
        return true;
    }

    private void initFields() {
        int[] viewIds = {R.id.create_name, R.id.create_email, R.id.create_phone_number, R.id.create_userName, R.id.create_password, R.id.create_bio};

        String[] preferenceKeys = {"name", "email", "phoneNumber", "username", "password", "bio"};

        for (int i = 0; i < viewIds.length; i++) {
            LabelAndEditTextView view = findViewById(viewIds[i]);
            EditText editText = view.getEnterUserEditText();
            String preferenceKey = preferenceKeys[i];
            String storedValue = sharedPreferences.getString(preferenceKey, "");
            editText.setText(storedValue);
        }
    }


}
