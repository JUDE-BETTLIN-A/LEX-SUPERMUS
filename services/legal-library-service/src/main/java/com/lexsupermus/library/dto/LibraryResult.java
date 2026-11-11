package com.lexsupermus.library.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** One hit from the legal corpus search. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LibraryResult {

    private String title;
    private String source;
    private String citation;
    private String summary;
}
