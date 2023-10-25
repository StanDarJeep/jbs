package com.example.edumatch.activities;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.RatingBar;
import android.widget.TextView;

import com.example.edumatch.R;
import com.example.edumatch.views.LabelAndRatingView;

import org.json.JSONException;
import org.json.JSONObject;

public class TuteeRateActivity extends AppCompatActivity {
    private double ratingValue;
    private boolean noShowValue;
    private boolean lateValue;

    //todo: I need the receiverId from the previous view
    //todo I need the receiverName from the previous view
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_tutee_rate);

        initName();
        initComponents();
        initSubmitButton();
    }

    private void initComponents() {
        CheckBox noShowCheckBox = findViewById(R.id.no_show);
        CheckBox lateCheckBox = findViewById(R.id.late);


        noShowCheckBox.setOnCheckedChangeListener((buttonView, isChecked) -> {
            noShowValue = isChecked;
        });

// Set an OnCheckedChangeListener for the Late CheckBox
        lateCheckBox.setOnCheckedChangeListener((buttonView, isChecked) -> {
            lateValue = isChecked;
        });
    }

    private void initName(){
        //todo insert name from previous view
        TextView name = findViewById(R.id.tutee_name);
        name.setText("NEED THIS INFO FROM PREVIOUS VIEW");
    }

    private void initSubmitButton() {
        Button submitButton = findViewById(R.id.submit_button);

        submitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                LabelAndRatingView attitudeTextView = findViewById(R.id.rating);
                RatingBar rating = attitudeTextView.getRatingView();
                ratingValue = rating.getRating();
                Boolean success = postReview();
                goToNewActivity();
            }
        });
    }

    private boolean postReview() {
        //todo: do post request to https://edumatch.canadacentral.cloudapp.azure.com/api/rating
        JSONObject requestBody = constructRatingRequest();
//        String apiUrl = "https://edumatch.canadacentral.cloudapp.azure.com/api/rating";
//        Context context = getApplicationContext(); // Replace with your application's context
//        SharedPreferences sharedPreferences = context.getSharedPreferences("AccountPreferences", Context.MODE_PRIVATE);
//        JSONObject jsonResponse = postDataToBackend(apiUrl, requestBody, sharedPreferences.getString("jwtToken", ""));
//
//        Log.d("RatingPost", "Finished postDataToBackend" + jsonResponse);
//
//        if (jsonResponse != null) {
//            Log.d("RatingPost", jsonResponse.toString());
//            return true;
//        } else {
//            Log.d("RatingPost", "jsonResponse was NULL");
//            return false;
//        }
        return true;
    }

    private JSONObject constructRatingRequest() {
        try {
            JSONObject requestBody = new JSONObject();
            requestBody.put("receiverId", "needthis");
            requestBody.put("rating", ratingValue);
            requestBody.put("noShow", noShowValue);
            requestBody.put("late", lateValue);

            logRequestToConsole(requestBody, "RatingPost");
            return requestBody;
        } catch (JSONException e) {
            e.printStackTrace();
            return null;
        }
    }

    private void goToNewActivity() {
        Intent newIntent;
        // todo go back to previous view
//        printSharedPreferences(sharedPreferences);
//        if(sharedPreferences.getBoolean("isEditing",false)){
//            newIntent = new Intent(CourseRatesActivity.this, EditProfileListActivity.class);
//        } else {
//            newIntent = new Intent(CourseRatesActivity.this, LocationInformationActivity.class);
//        }
//        startActivity(newIntent);
    }

    private void logRequestToConsole(JSONObject request, String tag) {
        Log.d(tag, "Request JSON: " + request.toString());
    }

}